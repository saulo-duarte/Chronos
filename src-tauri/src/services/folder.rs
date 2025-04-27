use diesel::sqlite::SqliteConnection;
use crate::repository::{get_folder_by_id, get_all_folders};
use crate::models::Folder;

pub fn build_path_from_parent(conn: &mut SqliteConnection, parent_id: Option<i32>) -> Result<String, String> {
    match parent_id {
        Some(id) => {
            let parent_folder = get_folder_by_id(conn, id)
                .map_err(|e| format!("Failed to find parent folder: {}", e))?;

            if parent_folder.parent_id.is_none() {
                Ok(format!("/{}", parent_folder.name))
            } else {
                let parent_path = build_path_from_parent(conn, parent_folder.parent_id)?;
                Ok(format!("{}/{}", parent_path.trim_end_matches('/'), parent_folder.name))
            }
        }
        None => Ok("/".to_string()),
    }
}

pub fn folder_name_exists(conn: &mut SqliteConnection, parent_id: Option<i32>, name_to_check: &str) -> Result<bool, String> {
    let folders = get_all_folders(conn).map_err(|e| format!("Failed to list folders: {}", e))?;

    Ok(folders.iter().any(|folder| {
        folder.parent_id == parent_id && folder.name.eq_ignore_ascii_case(name_to_check)
    }))
}

pub fn prepare_new_folder(
    conn: &mut SqliteConnection,
    name: String,
    parent_id: Option<i32>,
) -> Result<Folder, String> {
    if parent_id.is_none() {
        if !name.eq_ignore_ascii_case("root") {
            return Err("Only a 'root' folder can exist at the top level.".to_string());
        }

        let folders = get_all_folders(conn).map_err(|e| format!("Failed to list folders: {}", e))?;
        if folders.iter().any(|f| f.parent_id.is_none()) {
            return Err("Root folder already exists.".to_string());
        }
    }

    if folder_name_exists(conn, parent_id, &name)? {
        return Err(format!("A folder named '{}' already exists at this level.", name));
    }

    let parent_path = build_path_from_parent(conn, parent_id)?;
    let full_path = if parent_path == "/" {
        format!("/{}", name)
    } else {
        format!("{}/{}", parent_path.trim_end_matches('/'), name)
    };

    Ok(Folder {
        id: None,
        name,
        path: full_path,
        created_at: chrono::Local::now().naive_local().to_string(),
        last_accessed: None,
        parent_id,
    })
}
