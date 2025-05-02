use diesel::prelude::*;
use app_lib::models::NewCategory;
use app_lib::repository::{create_category, get_category_by_id, update_category, delete_category};
use app_lib::db::initialize::create_schema;
use diesel::sqlite::SqliteConnection;
use chrono::Local;

#[test]
fn test_create_and_get_category() {
    let mut conn = setup_test_db();

    let new_category = NewCategory {
        name: "Test Category",
        description: None,
        type_: "study",
        status: "active",
        created_at: Local::now().naive_local().to_string(),
        updated_at: None,
    };

    let created_category = create_category(&mut conn, new_category)
        .expect("Category creation failed");

    let fetched_category = get_category_by_id(&mut conn, created_category.id)
        .expect("Category fetch failed");

    assert_eq!(created_category.name, fetched_category.name);
    assert_eq!(created_category.status, fetched_category.status);
}

#[test]
fn test_update_category() {
    let mut conn = setup_test_db();

    let new_category = NewCategory {
        name: "Category to Update",
        description: None,
        type_: "study",
        status: "active",
        created_at: Local::now().naive_local().to_string(),
        updated_at: None,
    };

    let created_category = create_category(&mut conn, new_category)
        .expect("Category creation failed");

    let updated_at_str = Local::now().naive_local().to_string();
    let updated_category = NewCategory {
        name: "Updated Category",
        description: Some("Updated description"),
        type_: "project",
        status: "completed",
        created_at: created_category.created_at.clone(),
        updated_at: Some(&updated_at_str),
    };

    let updated_category_db = update_category(&mut conn, created_category.id, updated_category)
        .expect("Category update failed");

    assert_eq!(updated_category_db.name, "Updated Category");
    assert_eq!(updated_category_db.status, "completed");
}

#[test]
fn test_delete_category() {
    let mut conn = setup_test_db();

    let new_category = NewCategory {
        name: "Category to Delete",
        description: None,
        type_: "study",
        status: "active",
        created_at: Local::now().naive_local().to_string(),
        updated_at: None,
    };

    let created_category = create_category(&mut conn, new_category)
        .expect("Category creation failed");

    let deleted_rows = delete_category(&mut conn, created_category.id)
        .expect("Category deletion failed");

    assert_eq!(deleted_rows, 1);

    let result = get_category_by_id(&mut conn, created_category.id);
    assert!(result.is_err(), "Category should not exist after deletion");
}

fn setup_test_db() -> SqliteConnection {
    let mut conn = SqliteConnection::establish(":memory:")
        .expect("Failed to connect to the test database");

    create_schema(&mut conn).expect("Failed to create schema");

    conn
}
