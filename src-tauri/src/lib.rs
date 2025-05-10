pub mod commands;
pub mod config;
pub mod db;
pub mod models;
pub mod repository;
pub mod schema;
pub mod services;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
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
            add_file_command,
            get_all_files_command,
            get_file_by_id_command,
            get_files_by_folder_id_command,
            update_file_command,
            delete_file_command,
            add_category_command,
            get_category_by_id_command,
            get_all_categories_command,
            update_category_command,
            delete_category_command,
            add_task_command,
            get_task_by_id_command,
            get_all_tasks_command,
            update_task_status_command,
            update_task_recall_command,
            get_tasks_by_category_id_command,
            delete_task_command,
            set_task_done_command,
            update_task_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
