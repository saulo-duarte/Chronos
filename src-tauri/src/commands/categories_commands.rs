use crate::db::DbConnection;
use crate::models::Category;
use crate::repository::{
   create_category, delete_category, 
   get_all_categories, get_category_by_id, 
   update_category};
use crate::services::prepare_new_category;
use tauri::command;

#[command]
pub fn add_category_command(
    name: String,
    category_type: String,
    status: String,
) -> Result<Category, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    let new_category = prepare_new_category(&mut conn, &name, &category_type, &status)?;
    create_category(&mut conn, new_category).map_err(|e| e.to_string())
}

#[command]
pub fn get_category_by_id_command(category_id: i32) -> Result<Category, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    get_category_by_id(&mut conn, category_id).map_err(|e| e.to_string())
}

#[command]
pub fn get_all_categories_command() -> Result<Vec<Category>, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    get_all_categories(&mut conn).map_err(|e| e.to_string())
}

#[command]
pub fn update_category_command(
    category_id: i32,
    name: String,
    category_type: String,
    status: String,
) -> Result<Category, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    let now = chrono::Local::now().naive_local().to_string();
    let updated = crate::models::NewCategory {
        name: &name,
        description: None,
        type_: &category_type,
        status: &status,
        created_at: String::new(),
        updated_at: Some(&now),
    };

    update_category(&mut conn, category_id, updated).map_err(|e| e.to_string())
}

#[command]
pub fn delete_category_command(category_id: i32) -> Result<usize, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    delete_category(&mut conn, category_id).map_err(|e| e.to_string())
}
