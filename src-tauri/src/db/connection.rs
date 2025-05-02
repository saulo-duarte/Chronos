use crate::config::ConfigManager;
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use std::path::Path;

pub struct DbConnection;

impl DbConnection {
    pub fn connect_to_active_db() -> Result<SqliteConnection, String> {
        match ConfigManager::get_active_db() {
            Some(db_metadata) => {
                let db_path = db_metadata.path;

                if Path::new(&db_path).exists() {
                    SqliteConnection::establish(&db_path)
                        .map_err(|e| format!("Failed to connect to database: {}", e))
                } else {
                    Err(format!(
                        "The active database was not found at path: {}",
                        db_path
                    ))
                }
            }
            None => Err("No active database found.".to_string()),
        }
    }
}