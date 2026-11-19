use std::path::PathBuf;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_app_data_dir])
        .setup(|app| {
            let _ = app;
            Ok(())
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