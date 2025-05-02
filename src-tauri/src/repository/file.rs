use crate::models::{File, NewFile};
use crate::schema::files;
use diesel::insert_into;
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

pub fn add_file(
    conn: &mut SqliteConnection,
    new_file: &NewFile,
) -> Result<File, diesel::result::Error> {
    insert_into(files::table).values(new_file).execute(conn)?;

    files::table.order(files::id.desc()).first::<File>(conn)
}

pub fn get_all_files(conn: &mut SqliteConnection) -> Result<Vec<File>, diesel::result::Error> {
    use crate::schema::files::dsl::*;

    let results = files.load::<File>(conn)?;

    Ok(results)
}

pub fn get_file_by_id(
    conn: &mut SqliteConnection,
    file_id: i32,
) -> Result<File, diesel::result::Error> {
    use crate::schema::files::dsl::*;

    let result = files.filter(id.eq(file_id)).first::<File>(conn)?;

    Ok(result)
}

pub fn get_files_by_folder_id(
    conn: &mut SqliteConnection,
    folder_id_param: i32,
) -> Result<Vec<File>, diesel::result::Error> {
    use crate::schema::files::dsl::*;

    let results = files.filter(folder_id.eq(folder_id_param)).load::<File>(conn)?;

    Ok(results)
}

pub fn update_file(
    conn: &mut SqliteConnection,
    file_id: i32,
    updated_file: File,
) -> Result<File, diesel::result::Error> {
    use crate::schema::files::dsl::*;

    diesel::update(files.filter(id.eq(file_id)))
        .set((
            name.eq(&updated_file.name),
            is_favorite.eq(updated_file.is_favorite),
            file_type.eq(&updated_file.file_type),
            link.eq(updated_file.link.clone()),
            content.eq(updated_file.content.clone()),
            folder_id.eq(updated_file.folder_id),
            created_at.eq(&updated_file.created_at),
            updated_at.eq(updated_file.updated_at.clone()),
        ))
        .execute(conn)?;

    Ok(updated_file)
}

pub fn delete_file(
    conn: &mut SqliteConnection,
    file_id: i32,
) -> Result<usize, diesel::result::Error> {
    use crate::schema::files::dsl::*;

    diesel::delete(files.filter(id.eq(file_id))).execute(conn)
}
