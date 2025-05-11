use crate::db::DbConnection;
use crate::models::{Task, UpdateTaskData};
use crate::repository::TaskRepository;
use crate::services::prepare_new_task;
use tauri::command;

#[command]
pub fn add_task_command(
    title: String,
    description: Option<String>,
    category_id: Option<i32>,
    parent_id: Option<i32>,
    due_date: Option<String>,
) -> Result<Task, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;

    let new_task = prepare_new_task(
        &mut conn,
        &title,
        description.as_deref(),
        category_id,
        parent_id,
        due_date.as_deref()
    )?;

    TaskRepository::create(&mut conn, &new_task).map_err(|e| e.to_string())
}

#[command]
pub fn get_tasks_by_category_id_command(
    category_id: i32
) -> Result<Vec<Task>, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    TaskRepository::get_tasks_by_category_id(&mut conn, category_id).map_err(|e| e.to_string())
}

#[command]
pub fn get_task_by_id_command(task_id: i32) -> Result<Task, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    TaskRepository::get_by_id(&mut conn, task_id).map_err(|e| e.to_string())
}

#[command]
pub fn get_all_tasks_command() -> Result<Vec<Task>, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    TaskRepository::list(&mut conn).map_err(|e| e.to_string())
}

#[command]
pub fn update_task_status_command(
    task_id: i32,
    new_status: String
) -> Result<(), String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    TaskRepository::update_status(&mut conn, task_id, &new_status).map_err(|e| e.to_string())
}

#[command]
pub fn update_task_recall_command(
    task_id: i32,
    new_last_recall: Option<String>,
    new_recalls: Option<String>
) -> Result<(), String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    TaskRepository::update_recall_info(&mut conn, task_id, new_last_recall.as_deref(), new_recalls.as_deref())
        .map_err(|e| e.to_string())
}

#[command]
pub fn set_task_done_command(
    task_id: i32,
    done: bool
) -> Result<(), String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    TaskRepository::set_done(&mut conn, task_id, done).map_err(|e| e.to_string())
}

#[command]
pub fn delete_task_command(task_id: i32) -> Result<i32, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    let deleted_count = TaskRepository::delete(&mut conn, task_id).map_err(|e| e.to_string())?;
    
    if deleted_count > 0 {
        Ok(task_id)
    } else {
        Err(format!("Task with id {} not found", task_id))
    }
}

#[command]
pub fn update_task_command(
    task_id: i32,
    title: Option<String>,
    description: Option<String>,
    due_date: Option<String>
) -> Result<Task, String> {
    let mut conn = DbConnection::connect_to_active_db().map_err(|e| e.to_string())?;
    
    let update_data = UpdateTaskData {
        title: title.as_deref(),
        description: description.as_deref(),
        due_date: due_date.as_deref(),
    };

    let updated_task = TaskRepository::update_task(
        &mut conn,
        task_id,
        update_data
    ).map_err(|e| e.to_string())?;

    Ok(updated_task)
}