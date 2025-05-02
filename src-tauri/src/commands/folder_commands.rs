use crate::db::DbConnection;
use crate::models::Folder;
use crate::repository::{
    add_folder, delete_folder, get_all_folders, get_folder_by_id, update_folder,
};
use crate::services::prepare_new_folder;
use tauri::command;

#[command]
pub fn add_folder_command(name: String, parent_id: Option<i32>) -> Result<Folder, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    let new_folder = prepare_new_folder(&mut conn, name, parent_id)?;

    add_folder(&mut conn, &new_folder).map_err(|e| e.to_string())
}

#[command]
pub fn get_all_folders_command() -> Result<Vec<Folder>, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    get_all_folders(&mut conn).map_err(|e| e.to_string())
}

#[command]
pub fn get_folder_by_id_command(folder_id: i32) -> Result<Folder, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    get_folder_by_id(&mut conn, folder_id).map_err(|e| e.to_string())
}

#[command]
pub fn update_folder_command(folder_id: i32, name: String, path: String) -> Result<Folder, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    let updated_folder = Folder {
        id: Some(folder_id),
        name,
        path,
        created_at: chrono::Local::now().naive_local().to_string(),
        last_accessed: None,
        parent_id: None,
    };

    update_folder(&mut conn, folder_id, updated_folder).map_err(|e| e.to_string())
}

#[command]
pub fn delete_folder_command(folder_id: i32) -> Result<usize, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    delete_folder(&mut conn, folder_id).map_err(|e| e.to_string())
}
