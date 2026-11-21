use std::ffi::c_void;
use std::os::windows::io::RawHandle;
use std::ptr::null_mut;

#[repr(C)]
struct JobObjectBasicLimitInformation {
    per_process_user_time_limit: i64,
    per_job_user_time_limit: i64,
    limit_flags: u32,
    minimum_working_set_size: usize,
    maximum_working_set_size: usize,
    active_process_limit: u32,
    affinity: usize,
    priority_class: u32,
    scheduling_class: u32,
}

#[repr(C)]
struct IoCounters {
    read_operation_count: u64,
    write_operation_count: u64,
    other_operation_count: u64,
    read_transfer_count: u64,
    write_transfer_count: u64,
    other_transfer_count: u64,
}

#[repr(C)]
struct JobObjectExtendedLimitInformation {
    basic_limit_information: JobObjectBasicLimitInformation,
    io_info: IoCounters,
    process_memory_limit: usize,
    job_memory_limit: usize,
    peak_process_memory_used: usize,
    peak_job_memory_used: usize,
}

const JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE: u32 = 0x00002000;
const JOB_OBJECT_EXTENDED_LIMIT_INFORMATION: i32 = 9;

unsafe extern "system" {
    fn CreateJobObjectW(lp_job_attributes: *mut c_void, lp_name: *const u16) -> *mut c_void;
    fn SetInformationJobObject(
        h_job: *mut c_void,
        job_object_info_class: i32,
        lp_job_object_info: *const c_void,
        cb_job_object_info_length: u32,
    ) -> i32;
    fn AssignProcessToJobObject(h_job: *mut c_void, h_process: *mut c_void) -> i32;
    fn CloseHandle(h_object: *mut c_void) -> i32;
}

/// Safe wrapper around a Windows Job Object configured with JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE.
/// When this JobObject wrapper is dropped (or when the parent Tauri process terminates),
/// Windows automatically and unconditionally terminates all processes assigned to the job.
pub struct JobObject {
    handle: *mut c_void,
}

unsafe impl Send for JobObject {}
unsafe impl Sync for JobObject {}

impl JobObject {
    pub fn create() -> Result<Self, String> {
        unsafe {
            let handle = CreateJobObjectW(null_mut(), std::ptr::null());
            if handle.is_null() {
                return Err("Failed to create Win32 Job Object".to_string());
            }

            let mut info: JobObjectExtendedLimitInformation = std::mem::zeroed();
            info.basic_limit_information.limit_flags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;

            let res = SetInformationJobObject(
                handle,
                JOB_OBJECT_EXTENDED_LIMIT_INFORMATION,
                &info as *const _ as *const c_void,
                std::mem::size_of::<JobObjectExtendedLimitInformation>() as u32,
            );

            if res == 0 {
                CloseHandle(handle);
                return Err(
                    "Failed to set JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE on Job Object".to_string(),
                );
            }

            Ok(JobObject { handle })
        }
    }

    pub fn assign_process(&self, process_handle: RawHandle) -> Result<(), String> {
        unsafe {
            let res = AssignProcessToJobObject(self.handle, process_handle as *mut c_void);
            if res == 0 {
                return Err("Failed to assign child process to Windows Job Object".to_string());
            }
            Ok(())
        }
    }
}

impl Drop for JobObject {
    fn drop(&mut self) {
        if !self.handle.is_null() {
            unsafe {
                CloseHandle(self.handle);
            }
            self.handle = null_mut();
        }
    }
}
