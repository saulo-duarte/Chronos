use crate::config::{ConfigManager, DatabaseMetadata};
use std::path::PathBuf;
use tauri::command;

#[command]
pub fn get_active_db() -> Option<DatabaseMetadata> {
    ConfigManager::get_active_db()
}

#[command]
pub fn set_active_db(name: String) -> Result<(), String> {
    ConfigManager::set_active_db(&name)
}

#[command]
pub fn add_database(name: String, path: String) -> Result<(), String> {
    ConfigManager::add_database(name, path)
}

#[command]
pub fn remove_database(name: String) -> Result<(), String> {
    ConfigManager::remove_database(&name)
}

#[command]
pub fn list_databases() -> Vec<DatabaseMetadata> {
    ConfigManager::list_databases()
}

#[command]
pub fn set_last_directory(path: PathBuf) -> Result<(), String> {
    ConfigManager::set_last_directory(path)
}

#[command]
pub fn get_last_directory() -> Option<PathBuf> {
    ConfigManager::get_last_directory()
}

#[command]
pub fn refresh_databases() -> Result<(), String> {
    ConfigManager::refresh_databases()
}

#[command]
pub fn get_base_directory() -> Result<Option<String>, String> {
    match ConfigManager::get_last_directory() {
        Some(path) => Ok(Some(path.to_string_lossy().to_string())),
        None => Ok(None),
    }
}