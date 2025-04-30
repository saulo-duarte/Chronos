use diesel::{Queryable, Insertable};
use serde::{Deserialize, Serialize};
use crate::schema::files;

#[derive(Debug, Serialize, Deserialize, Queryable, Clone)]
pub struct File {
    pub id: Option<i32>,
    pub name: String,
    pub is_favorite: bool,
    pub file_type: String,
    pub link: Option<String>,
    pub content: Vec<u8>,
    pub folder_id: i32,
    pub created_at: String,
    pub updated_at: Option<String>,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = files)]
pub struct NewFile<'a> {
    pub name: &'a str,
    pub is_favorite: bool,
    pub file_type: &'a str,
    pub link: Option<&'a str>,
    pub content: &'a [u8],
    pub folder_id: i32,
    pub created_at: String,
    pub updated_at: Option<String>,
}
