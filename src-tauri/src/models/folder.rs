use crate::schema::folders;
use chrono::NaiveDateTime;
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Clone)]
#[diesel(table_name = folders)]
pub struct Folder {
    pub id: Option<i32>,
    pub name: String,
    pub path: String,
    pub created_at: String,
    pub last_accessed: Option<String>,
    pub parent_id: Option<i32>,
}

impl Folder {
    pub fn get_created_at_datetime(&self) -> Result<NaiveDateTime, chrono::ParseError> {
        NaiveDateTime::parse_from_str(&self.created_at, "%Y-%m-%d %H:%M:%S")
    }

    pub fn get_last_accessed_datetime(&self) -> Option<Result<NaiveDateTime, chrono::ParseError>> {
        self.last_accessed
            .as_ref()
            .map(|date_str| NaiveDateTime::parse_from_str(date_str, "%Y-%m-%d %H:%M:%S"))
    }

    pub fn set_created_at_datetime(&mut self, dt: NaiveDateTime) {
        self.created_at = dt.format("%Y-%m-%d %H:%M:%S").to_string();
    }

    pub fn set_last_accessed_datetime(&mut self, dt: Option<NaiveDateTime>) {
        self.last_accessed = dt.map(|dt| dt.format("%Y-%m-%d %H:%M:%S").to_string());
    }
}
