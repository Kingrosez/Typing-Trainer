fn main() {
    if let Ok(path) = std::env::var("PATH") {
        if !path.contains("msys64") && std::path::Path::new(r"C:\msys64\mingw64\bin").exists() {
            // SAFETY: In single-threaded build script execution before tauri_build invokes external windres tool
            unsafe {
                std::env::set_var("PATH", format!(r"C:\msys64\mingw64\bin;{}", path));
            }
        }
    }
    tauri_build::build()
}
