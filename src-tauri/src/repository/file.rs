use diesel::insert_into;
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use crate::models::{File, NewFile};
use crate::schema::files;

pub fn add_file(conn: &mut SqliteConnection, new_file: &NewFile) -> Result<File, diesel::result::Error> {
    insert_into(files::table)
        .values(new_file)
        .execute(conn)?;

    files::table
        .order(files::id.desc())
        .first::<File>(conn)
}
