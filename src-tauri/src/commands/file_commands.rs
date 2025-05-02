use crate::db::DbConnection;
use crate::models::File;
use crate::repository::add_file;
use crate::services::prepare_new_file;
use chrono::Local;
use tauri::command;

#[command]
pub fn add_file_command(
    name: String,
    content: Option<Vec<u8>>,
    link: Option<String>,
    folder_id: i32,
    is_favorite: bool,
) -> Result<File, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    let new_file =
        prepare_new_file(&name, content.as_deref(), link.as_deref(), folder_id, is_favorite)?;

    add_file(&mut conn, &new_file).map_err(|e| e.to_string())
}

#[command]
pub fn get_all_files_command() -> Result<Vec<File>, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    crate::repository::get_all_files(&mut conn).map_err(|e| e.to_string())
}

#[command]
pub fn get_file_by_id_command(file_id: i32) -> Result<File, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    crate::repository::get_file_by_id(&mut conn, file_id).map_err(|e| e.to_string())
}

#[command]
pub fn get_files_by_folder_id_command(folder_id_param: i32) -> Result<Vec<File>, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    crate::repository::get_files_by_folder_id(&mut conn, folder_id_param).map_err(|e| e.to_string())
}

#[command]
pub fn update_file_command(
    file_id: i32,
    name: String,
    is_favorite: bool,
    file_type: String,
    link: Option<String>,
    content: Option<Vec<u8>>,
    created_time: String,
    folder_id: i32,
) -> Result<File, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    let updated_file = File {
        id: Some(file_id),
        name,
        is_favorite,
        file_type,
        link,
        content: content.unwrap_or(vec![]),
        folder_id,
        created_at: created_time,
        updated_at: Some(Local::now().naive_local().to_string()),
    };

    crate::repository::update_file(&mut conn, file_id, updated_file).map_err(|e| e.to_string())
}

#[command]
pub fn delete_file_command(file_id: i32) -> Result<usize, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    crate::repository::delete_file(&mut conn, file_id).map_err(|e| e.to_string())
}
