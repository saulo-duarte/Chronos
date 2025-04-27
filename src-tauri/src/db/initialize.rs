use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

pub fn create_schema(conn: &mut SqliteConnection) -> Result<(), diesel::result::Error> {
    diesel::sql_query(
        "CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_accessed TEXT,
            parent_id INTEGER,
            FOREIGN KEY (parent_id) REFERENCES folders(id)
        );"
    ).execute(conn)?;

    #[derive(diesel::QueryableByName)]
    struct CountResult {
        #[sql_type = "diesel::sql_types::BigInt"]
        count: i64,
    }

    let folder_count: i64 = diesel::sql_query("SELECT COUNT(*) AS count FROM folders")
        .get_result::<CountResult>(conn)?
        .count;

    if folder_count == 0 {
        diesel::sql_query(
            "INSERT INTO folders (name, path, created_at, last_accessed, parent_id)
             VALUES ('root', '/', datetime('now'), NULL, NULL);"
        ).execute(conn)?;
    }

    Ok(())
}
