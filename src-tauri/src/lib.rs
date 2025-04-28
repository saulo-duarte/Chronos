pub mod commands;
pub mod config;
pub mod db;
pub mod models;
pub mod schema;
pub mod repository;
pub mod services;

use commands::{
    add_database, get_active_db, get_last_directory, list_databases, 
    refresh_databases,remove_database, set_active_db, set_last_directory,
    add_folder_command, get_all_folders_command, get_folder_by_id_command,
    update_folder_command, delete_folder_command, close_window,
    minimize_window, maximize_window,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_active_db,
            set_active_db,
            add_database,
            remove_database,
            list_databases,
            set_last_directory,
            get_last_directory,
            refresh_databases,
            add_folder_command,
            get_all_folders_command,
            get_folder_by_id_command,
            update_folder_command,
            delete_folder_command,
            close_window,
            minimize_window,
            maximize_window,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
