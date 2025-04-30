use tauri::command;
use crate::db::DbConnection;
use crate::services::prepare_new_file;
use crate::repository::add_file;
use crate::models::File;

#[command]
pub fn add_file_command(
    name: String,
    file_type: String,
    content: Vec<u8>,
    link: Option<String>,
    folder_id: i32,
    is_favorite: bool,
) -> Result<File, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    let new_file = prepare_new_file(
        &name,
        &file_type,
        &content,
        link.as_deref(),
        folder_id,
        is_favorite,
    )?;

    add_file(&mut conn, &new_file).map_err(|e| e.to_string())
}
