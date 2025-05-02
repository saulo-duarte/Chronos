use diesel::sqlite::SqliteConnection;
use diesel::Connection;
use crate::db::initialize::create_schema;

pub fn setup_test_db() -> SqliteConnection {
    let mut conn = SqliteConnection::establish(":memory:")
        .expect("Failed to create in-memory database");

    create_schema(&mut conn).expect("Failed to initialize schema");

    conn
}
