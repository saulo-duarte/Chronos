use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use std::path::Path;
use crate::config::ConfigManager;

pub struct DbConnection;

impl DbConnection {
    pub fn connect_to_active_db() -> Result<SqliteConnection, String> {
        match ConfigManager::get_active_db() {
            Some(db_metadata) => {
                let db_path = db_metadata.path;

                if Path::new(&db_path).exists() {
                    SqliteConnection::establish(&db_path)
                        .map_err(|e| format!("Falha ao conectar com o banco de dados: {}", e))
                } else {
                    Err(format!("O banco de dados ativo não foi encontrado no caminho: {}", db_path))
                }
            }
            None => {
                Err("Nenhum banco de dados ativo encontrado.".to_string())
            }
        }
    }
}

