use diesel::sql_query;
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

pub fn create_schema(conn: &mut SqliteConnection) -> Result<(), diesel::result::Error> {
    sql_query("PRAGMA foreign_keys = ON;").execute(conn)?;

    sql_query(
        "CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_accessed TEXT,
            parent_id INTEGER,
            FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
        );"
    ).execute(conn)?;

    sql_query(
        "CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            is_favorite BOOLEAN NOT NULL,
            file_type TEXT NOT NULL,
            link TEXT,
            content BLOB,
            folder_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
        );"
    ).execute(conn)?;

    sql_query(
        "CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            type TEXT NOT NULL CHECK(type IN ('project', 'study')),
            status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'archived', 'completed', 'on_hold')),
            created_at TEXT NOT NULL,
            updated_at TEXT
        );"
    ).execute(conn)?;

    sql_query(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL CHECK(status IN ('not_initialized', 'in_progress', 'done', 'recall', 'to_do')),
            type TEXT NOT NULL CHECK(type IN ('project', 'study', 'event')),
            parent_id INTEGER,
            category_id INTEGER,
            due_date TEXT,
            last_recall TEXT,
            recalls TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );"
    ).execute(conn)?;

    #[derive(diesel::QueryableByName)]
    struct CountResult {
        #[sql_type = "diesel::sql_types::BigInt"]
        count: i64,
    }

    let folder_count: i64 = sql_query("SELECT COUNT(*) AS count FROM folders")
        .get_result::<CountResult>(conn)?
        .count;

    if folder_count == 0 {
        sql_query(
            "INSERT INTO folders (name, path, created_at, last_accessed, parent_id)
             VALUES ('/', '/', datetime('now'), NULL, NULL);"
        ).execute(conn)?;
    }

    Ok(())
}