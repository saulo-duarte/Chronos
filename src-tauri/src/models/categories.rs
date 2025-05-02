use crate::schema::categories;
use diesel::{Insertable, Queryable, Identifiable};
use serde::{Deserialize, Serialize};

#[derive(Debug, Queryable, Identifiable, Serialize, Deserialize)]
#[diesel(table_name = categories)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    #[serde(rename = "type")]
    pub type_: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: Option<String>,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name = categories)]
pub struct NewCategory<'a> {
    pub name: &'a str,
    pub description: Option<&'a str>,
    #[serde(rename = "type")]
    pub type_: &'a str,
    pub status: &'a str,
    pub created_at: String,
    pub updated_at: Option<&'a str>,
}
