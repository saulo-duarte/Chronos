use crate::models::NewCategory;
use crate::repository::get_all_categories;
use diesel::sqlite::SqliteConnection;
use chrono::Local;

pub fn prepare_new_category<'a>(
    conn: &mut SqliteConnection,
    name: &'a str,
    category_type: &'a str,
    status: &'a str,
) -> Result<NewCategory<'a>, String> {
    if category_name_exists(conn, name)? {
        return Err(format!("A category with name '{}' already exists.", name));
    }

    if !["project", "study", "event"].contains(&category_type) {
        return Err("Invalid category type.".to_string());
    }
    
    Ok(NewCategory {
        name,
        description: None,
        type_: category_type,
        status,
        created_at: Local::now().naive_local().to_string(),
        updated_at: None,
    })
}


pub fn category_name_exists(
    conn: &mut SqliteConnection,
    name_to_check: &str,
) -> Result<bool, String> {
    let categories = get_all_categories(conn).map_err(|e| format!("Failed to list categories: {}", e))?;
    Ok(categories.iter().any(|category| category.name.eq_ignore_ascii_case(name_to_check)))
}