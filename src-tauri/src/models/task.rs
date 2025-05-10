use crate::schema::tasks;
use diesel::{Queryable, Identifiable, Insertable, AsChangeset};
use serde::{Deserialize, Serialize};

#[derive(Debug, Queryable, Identifiable, Serialize, Deserialize)]
#[diesel(table_name = tasks)]
pub struct Task {
    pub id: i32,
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    #[serde(rename = "type")]
    pub type_: String,
    pub parent_id: Option<i32>,
    pub category_id: Option<i32>,
    pub due_date: Option<String>,
    pub last_recall: Option<String>,
    pub recalls: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
}

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = tasks)]
pub struct NewTask {
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    #[serde(rename = "type")]
    pub type_: String,
    pub parent_id: Option<i32>,
    pub category_id: Option<i32>,
    pub due_date: Option<String>,
    pub last_recall: Option<String>,
    pub recalls: Option<String>,
    pub created_at: String,
    pub updated_at: Option<String>,
}

#[derive(AsChangeset)]
#[diesel(table_name = tasks)]
pub struct UpdateTaskData<'a> {
    pub title: Option<&'a str>,
    pub description: Option<&'a str>,
    pub due_date: Option<&'a str>,
}
