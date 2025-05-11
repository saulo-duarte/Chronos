use serde::{Deserialize, Serialize};
use std::error::Error;
use std::{
    collections::HashMap,
    fs,
    io::Write,
    path::{Path, PathBuf},
};

use crate::db::initialize::create_schema;
use diesel::sqlite::SqliteConnection;
use diesel::Connection;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DatabaseMetadata {
    pub name: String,
    pub path: String,
    pub created_at: String,
    pub last_accessed: Option<String>,
    pub is_active: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    pub active_db: Option<String>,
    pub databases: HashMap<String, DatabaseMetadata>,
    pub last_directory: Option<PathBuf>,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self { active_db: None, databases: HashMap::new(), last_directory: None }
    }
}

pub struct ConfigManager;

impl ConfigManager {
    pub fn get_config_dir() -> Result<PathBuf, String> {
        dirs::config_dir()
            .map(|mut path| {
                path.push("Chronos");
                if let Err(e) = fs::create_dir_all(&path) {
                    return Err(format!("Failed to create config directory: {}", e));
                }
                Ok(path)
            })
            .unwrap_or_else(|| Err("Could not locate the config directory.".to_string()))
    }

    pub fn get_config_path() -> Result<PathBuf, String> {
        let mut path = Self::get_config_dir()?;
        path.push("config.json");
        Ok(path)
    }

    pub fn load_config() -> AppConfig {
        match Self::get_config_path() {
            Ok(path) => match fs::read_to_string(&path) {
                Ok(content) => match serde_json::from_str(&content) {
                    Ok(config) => config,
                    Err(_) => AppConfig::default(),
                },
                Err(_) => {
                    let config = AppConfig::default();
                    let _ = Self::save_config(&config);
                    config
                }
            },
            Err(_) => AppConfig::default(),
        }
    }

    pub fn save_config(config: &AppConfig) -> Result<(), Box<dyn Error>> {
        let path = Self::get_config_path()?;
        let json = serde_json::to_string_pretty(config)?;
        let mut file = fs::File::create(path)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }

    pub fn get_active_db() -> Option<DatabaseMetadata> {
        let config = Self::load_config();

        if let Some(active_db_name) = config.active_db {
            config.databases.get(&active_db_name).cloned()
        } else {
            None
        }
    }

    pub fn set_active_db(name: &str) -> Result<(), String> {
        let mut config = Self::load_config();

        if config.databases.contains_key(name) {
            config.active_db = Some(name.to_string());

            if let Some(db_info) = config.databases.get_mut(name) {
                db_info.last_accessed = Some(chrono::Local::now().to_rfc3339());
            
                let mut conn = SqliteConnection::establish(&db_info.path)
                    .map_err(|e| format!("Failed to connect to database: {}", e))?;
            
                create_schema(&mut conn).map_err(|e| format!("Failed to update schema: {}", e))?;
            }

            Self::save_config(&config).map_err(|e| e.to_string())
        } else {
            Err(format!("Database '{}' not found.", name))
        }
    }

    pub fn add_database(name: String, path: String) -> Result<(), String> {
        let db_path = Path::new(&path).join(format!("{}.db", name));

        if db_path.exists() {
            return Err(format!("Database '{}' already exists.", name));
        }

        fs::create_dir_all(&path)
            .map_err(|e| format!("Failed to create database directory: {}", e))?;

        let mut conn = SqliteConnection::establish(&db_path.to_str().unwrap())
            .map_err(|e| format!("Failed to establish connection: {}", e))?;

        create_schema(&mut conn).map_err(|e| format!("Failed to create database schema: {}", e))?;

        let mut config = ConfigManager::load_config();

        if config.databases.contains_key(&name) {
            return Err(format!("Database '{}' already exists in config.", name));
        }

        let metadata = DatabaseMetadata {
            name: name.clone(),
            path: db_path.to_str().unwrap().to_string(),
            created_at: chrono::Local::now().to_rfc3339(),
            last_accessed: None,
            is_active: false,
        };

        config.databases.insert(name.clone(), metadata);

        if config.active_db.is_none() {
            config.active_db = Some(name);
        }

        ConfigManager::save_config(&config).map_err(|e| e.to_string())?;

        Ok(())
    }

    pub fn remove_database(name: &str) -> Result<(), String> {
        let mut config = Self::load_config();
    
        let metadata = config.databases.remove(name)
            .ok_or_else(|| format!("Database '{}' not found.", name))?;
    
        if config.active_db.as_deref() == Some(name) {
            config.active_db = config.databases.keys().next().cloned();
        }
    
        Self::save_config(&config).map_err(|e| e.to_string())?;
    
        let db_path = Path::new(&metadata.path);
        if db_path.exists() {
            fs::remove_file(db_path)
                .map_err(|e| format!("Failed to delete database file '{}': {}", db_path.display(), e))?;
        }
    
        Ok(())
    }

    pub fn set_last_directory(path: PathBuf) -> Result<(), String> {
        let mut config = Self::load_config();
        config.last_directory = Some(path);
        Self::save_config(&config).map_err(|e| e.to_string())
    }

    pub fn get_last_directory() -> Option<PathBuf> {
        Self::load_config().last_directory
    }

    pub fn list_databases() -> Vec<DatabaseMetadata> {
        let config = Self::load_config();
        let active_name = config.active_db.as_deref();
    
        config.databases
            .values()
            .map(|db| {
                let mut db = db.clone();
                db.is_active = Some(db.name.as_str()) == active_name;
                db
            })
            .collect()
    }
    
    pub fn refresh_databases() -> Result<(), String> {
        let mut config = Self::load_config();

        let dir = config.last_directory.as_ref().ok_or("No base directory set.")?;

        let entries = fs::read_dir(dir).map_err(|e| format!("Error reading directory: {}", e))?;

        for entry in entries {
            let entry = entry.map_err(|e| format!("Error reading entry: {}", e))?;
            let path = entry.path();

            if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext == "sqlite" || ext == "db" {
                        let file_name = path.file_stem().unwrap().to_string_lossy().to_string();
                        let path_str = path.to_string_lossy().to_string();

                        if !config.databases.values().any(|db| db.path == path_str) {
                            let metadata = DatabaseMetadata {
                                name: file_name.clone(),
                                path: path_str,
                                created_at: chrono::Local::now().to_rfc3339(),
                                last_accessed: None,
                                is_active: false,
                            };

                            config.databases.insert(file_name, metadata);
                        }
                    }
                }
            }
        }

        Self::save_config(&config).map_err(|e| e.to_string())
    }
}
