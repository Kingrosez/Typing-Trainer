use std::path::PathBuf;
use tauri::{Manager, State};

pub mod backend;
use backend::{BackendConnectionInfo, BackendManager};

struct AppState {
    backend: BackendManager,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .manage(AppState {
            backend: BackendManager::new(),
        })
        .invoke_handler(tauri::generate_handler![
            get_app_data_dir,
            get_backend_connection,
            start_backend
        ])
        .setup(|app| {
            let state = app.state::<AppState>();
            // Spawn backend startup in background thread to avoid blocking UI window initialization
            let backend_manager = &state.backend;
            let _ = backend_manager; // ready for explicit start or background start
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                if window.label() == "main" {
                    let state = window.state::<AppState>();
                    state.backend.shutdown();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}

#[tauri::command]
fn get_app_data_dir() -> Result<PathBuf, String> {
    let dir = dirs::data_dir()
        .ok_or("Could not find user data directory")?
        .join("TypingTrainer");
    Ok(dir)
}

#[tauri::command]
fn start_backend(state: State<'_, AppState>) -> Result<BackendConnectionInfo, String> {
    state.backend.start()
}

#[tauri::command]
fn get_backend_connection(state: State<'_, AppState>) -> Result<BackendConnectionInfo, String> {
    state.backend.get_connection()
}
