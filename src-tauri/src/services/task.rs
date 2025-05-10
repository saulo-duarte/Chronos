use crate::models::NewTask;
use crate::repository::{get_category_by_id, task_exists};
use diesel::sqlite::SqliteConnection;
use chrono::{Local, Duration};
use serde_json;

pub fn prepare_new_task(
    conn: &mut SqliteConnection,
    title: &str,
    description: Option<&str>,
    category_id: Option<i32>,
    parent_id: Option<i32>,
    due_date: Option<&str>,
) -> Result<NewTask, String>{
    let task_type = resolve_task_type(conn, category_id)?;
    validate_parent_task(conn, parent_id)?;

    match task_type.as_str() {
        "project" => {
            if parent_id.is_some() {
                prepare_project_subtask(title, description, category_id, parent_id, due_date)
            } else {
                prepare_main_project_task(title, description, category_id, due_date)
            }
        }
        "study" => prepare_study_task(title, description, category_id, due_date),
        "event" => prepare_event_task(title, description, due_date),
        _ => Err("Invalid task type.".to_string()),
    }
}

fn prepare_main_project_task(
    title: &str,
    description: Option<&str>,
    category_id: Option<i32>,
    due_date: Option<&str>,
) -> Result<NewTask, String> {
    let now = now_string();
    
    Ok(NewTask {
        title: title.to_string(),
        description: description.map(|s| s.to_string()),
        status: "not_initialized".to_string(),
        type_: "project".to_string(),
        parent_id: None,
        category_id,
        due_date: due_date.map(|s| s.to_string()),
        last_recall: None,
        recalls: None,
        created_at: now.clone(),
        updated_at: Some(now),
    })
}

fn prepare_project_subtask(
    title: &str,
    description: Option<&str>,
    category_id: Option<i32>,
    parent_id: Option<i32>,
    due_date: Option<&str>,
) -> Result<NewTask, String> {
    let now = now_string();
    
    Ok(NewTask {
        title: title.to_string(),
        description: description.map(|s| s.to_string()),
        status: "to_do".to_string(),
        type_: "project".to_string(),
        parent_id,
        category_id,
        due_date: due_date.map(|s| s.to_string()),
        last_recall: None,
        recalls: None,
        created_at: now.clone(),
        updated_at: Some(now),
    })
}

fn prepare_study_task(
    title: &str,
    description: Option<&str>,
    category_id: Option<i32>,
    due_date: Option<&str>,
) -> Result<NewTask, String> {
    let recalls_vec = generate_recalls();
    let recalls_json = serde_json::to_string(&recalls_vec)
        .map_err(|e| format!("Failed to serialize recalls: {}", e))?;

    let now = now_string();

    Ok(NewTask {
        title: title.to_string(),
        description: description.map(|s| s.to_string()),
        status: "to_do".to_string(),
        type_: "study".to_string(),
        parent_id: None,
        category_id,
        due_date: due_date.map(|s| s.to_string()),
        last_recall: Some(now.clone()),
        recalls: Some(recalls_json),
        created_at: now.clone(),
        updated_at: Some(now),
    })
}



fn prepare_event_task(
    title: &str,
    description: Option<&str>,
    due_date: Option<&str>,
) -> Result<NewTask, String> {
    if due_date.is_none() {
        return Err("Due date is required for event tasks.".to_string());
    }

    let now = now_string();

    Ok(NewTask {
        title: title.to_string(),
        description: description.map(|s| s.to_string()),
        status: "to_do".to_string(),
        type_: "event".to_string(),
        parent_id: None,
        category_id: None,
        due_date: due_date.map(|s| s.to_string()),
        last_recall: None,
        recalls: None,
        created_at: now.clone(),
        updated_at: Some(now),
    })
}

fn resolve_task_type(
    conn: &mut SqliteConnection,
    category_id: Option<i32>,
) -> Result<String, String> {
    if let Some(cat_id) = category_id {
        let category = get_category_by_id(conn, cat_id)
            .map_err(|_| format!("Category with id {} not found", cat_id))?;
        Ok(category.type_)
    } else {
        Ok("event".to_string())
    }
}


fn validate_parent_task(
    conn: &mut SqliteConnection,
    parent_id: Option<i32>,
) -> Result<(), String> {
    if let Some(pid) = parent_id {
        let exists = task_exists(conn, pid)
            .map_err(|e| format!("Database error: {}", e))?;
        if !exists {
            return Err(format!("Parent task with id {} does not exist.", pid));
        }
    }
    Ok(())
}

fn generate_recalls() -> Vec<String> {
    let now = Local::now().naive_local();
    vec![
        now.to_string(),
        (now + Duration::days(2)).to_string(),
        (now + Duration::days(5)).to_string(),
    ]
}

fn now_string() -> String {
    Local::now().naive_local().to_string()
}
