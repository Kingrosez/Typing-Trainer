use std::io::{BufRead, BufReader};
use std::os::windows::io::AsRawHandle;
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use log::info;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::job_object::JobObject;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackendConnectionInfo {
    pub port: u16,
    pub token: String,
    pub base_url: String,
}

pub struct BackendManager {
    child: Arc<Mutex<Option<Child>>>,
    job_object: Arc<Mutex<Option<JobObject>>>,
    connection_info: Arc<Mutex<Option<BackendConnectionInfo>>>,
}

impl BackendManager {
    pub fn new() -> Self {
        Self {
            child: Arc::new(Mutex::new(None)),
            job_object: Arc::new(Mutex::new(None)),
            connection_info: Arc::new(Mutex::new(None)),
        }
    }

    pub fn start(&self) -> Result<BackendConnectionInfo, String> {
        info!("Initializing Windows Job Object for backend child process supervision...");
        let job = JobObject::create()?;

        // Generate per-launch cryptographically secure random token (UUID v4)
        let token = Uuid::new_v4().to_string();

        let (jar_path, is_jar) = locate_backend_artifact();
        let db_path = get_database_path();

        info!("Starting Spring Boot backend (is_jar={}) with database path: {:?}", is_jar, db_path);

        let mut cmd = if is_jar {
            let mut c = Command::new("java");
            c.arg("-jar")
                .arg(&jar_path)
                .arg(format!("--TYPING_TRAINER_AUTH_TOKEN={}", token))
                .arg(format!("--TYPING_TRAINER_DB_PATH={}", db_path.display()))
                .arg("--server.port=0")
                .arg("--server.address=127.0.0.1");
            c
        } else {
            // Development fallback: run packaged jar if available in target, or run via mvnw
            let target_jar = PathBuf::from("..").join("backend").join("target").join("typing-trainer-backend-0.1.0-SNAPSHOT.jar");
            if target_jar.exists() {
                let mut c = Command::new("java");
                c.arg("-jar")
                    .arg(target_jar)
                    .arg(format!("--TYPING_TRAINER_AUTH_TOKEN={}", token))
                    .arg(format!("--TYPING_TRAINER_DB_PATH={}", db_path.display()))
                    .arg("--server.port=0")
                    .arg("--server.address=127.0.0.1");
                c
            } else {
                let mut c = Command::new("cmd");
                c.current_dir(PathBuf::from("..").join("backend"))
                    .arg("/c")
                    .arg(format!("mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=\"--TYPING_TRAINER_AUTH_TOKEN={} --TYPING_TRAINER_DB_PATH='{}' --server.port=0 --server.address=127.0.0.1\"", token, db_path.display()));
                c
            }
        };

        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::piped());

        let mut child_proc = cmd.spawn().map_err(|e| format!("Failed to spawn backend process: {}", e))?;

        // Assign child process handle to Win32 Job Object before capturing stdout
        job.assign_process(child_proc.as_raw_handle())?;
        info!("Assigned child process (PID: {:?}) to Win32 Job Object", child_proc.id());

        let stdout = child_proc.stdout.take().ok_or("Failed to capture backend stdout")?;

        // Capture port from stdout handshake line: "[TYPING_TRAINER_BACKEND_PORT] port=<PORT>"
        let port = match read_port_handshake(stdout, Duration::from_secs(45)) {
            Ok(p) => p,
            Err(e) => {
                let _ = child_proc.kill();
                return Err(format!("Backend startup failed: {}", e));
            }
        };

        info!("Backend startup handshake received: Port {}", port);

        let info = BackendConnectionInfo {
            port,
            token,
            base_url: format!("http://127.0.0.1:{}", port),
        };

        *self.child.lock().unwrap() = Some(child_proc);
        *self.job_object.lock().unwrap() = Some(job);
        *self.connection_info.lock().unwrap() = Some(info.clone());

        Ok(info)
    }

    pub fn get_connection(&self) -> Result<BackendConnectionInfo, String> {
        self.connection_info
            .lock()
            .unwrap()
            .clone()
            .ok_or_else(|| "Backend is not currently running or initialized".to_string())
    }

    pub fn shutdown(&self) {
        info!("Shutting down backend manager and child processes...");
        if let Some(mut child) = self.child.lock().unwrap().take() {
            let _ = child.kill();
        }
        // Dropping job_object closes handle, triggering JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
        self.job_object.lock().unwrap().take();
        *self.connection_info.lock().unwrap() = None;
        info!("Backend shutdown complete.");
    }
}

fn locate_backend_artifact() -> (PathBuf, bool) {
    if let Ok(exe_dir) = std::env::current_exe() {
        let bundled_jar = exe_dir.parent().unwrap_or(&exe_dir).join("resources").join("typing-trainer-backend.jar");
        if bundled_jar.exists() {
            return (bundled_jar, true);
        }
    }
    (PathBuf::from("typing-trainer-backend.jar"), false)
}

fn get_database_path() -> PathBuf {
    dirs::data_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("TypingTrainer")
        .join("data")
        .join("typing-trainer.db")
}

fn read_port_handshake<R: std::io::Read + Send + 'static>(
    reader: R,
    timeout: Duration,
) -> Result<u16, String> {
    let (tx, rx) = std::sync::mpsc::channel();
    let start_time = Instant::now();

    std::thread::spawn(move || {
        let buf_reader = BufReader::new(reader);
        for line in buf_reader.lines() {
            if let Ok(text) = line {
                if text.contains("[TYPING_TRAINER_BACKEND_PORT] port=") {
                    if let Some(pos) = text.find("port=") {
                        let port_part = &text[pos + 5..].trim();
                        if let Ok(port) = port_part.parse::<u16>() {
                            let _ = tx.send(Ok(port));
                            return;
                        }
                    }
                }
            }
        }
        let _ = tx.send(Err("Backend stdout stream closed before port handshake".to_string()));
    });

    while start_time.elapsed() < timeout {
        if let Ok(result) = rx.recv_timeout(Duration::from_millis(200)) {
            return result;
        }
    }

    Err(format!("Timed out after {}s waiting for backend port handshake", timeout.as_secs()))
}
