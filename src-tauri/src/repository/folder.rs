use crate::models::Folder;
use crate::schema::folders;
use diesel::dsl::{delete, update};
use diesel::insert_into;
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

pub fn add_folder(
    conn: &mut SqliteConnection,
    new_folder: &Folder,
) -> Result<Folder, diesel::result::Error> {
    insert_into(folders::table).values(new_folder).execute(conn)?;

    let inserted_folder = folders::table
        .filter(folders::name.eq(&new_folder.name))
        .filter(folders::parent_id.eq(new_folder.parent_id))
        .first::<Folder>(conn)?;

    Ok(inserted_folder)
}

pub fn get_all_folders(conn: &mut SqliteConnection) -> Result<Vec<Folder>, diesel::result::Error> {
    use crate::schema::folders::dsl::*;

    let results = folders.load::<Folder>(conn)?;

    Ok(results)
}

pub fn get_folder_by_id(
    conn: &mut SqliteConnection,
    folder_id: i32,
) -> Result<Folder, diesel::result::Error> {
    use crate::schema::folders::dsl::*;

    let result = folders.filter(id.eq(folder_id)).first::<Folder>(conn)?;

    Ok(result)
}

pub fn update_folder(
    conn: &mut SqliteConnection,
    folder_id: i32,
    updated_folder: Folder,
) -> Result<Folder, diesel::result::Error> {
    update(folders::table.filter(folders::id.eq(folder_id)))
        .set((
            folders::name.eq(&updated_folder.name),
            folders::path.eq(&updated_folder.path),
            folders::created_at.eq(&updated_folder.created_at),
            folders::last_accessed.eq(&updated_folder.last_accessed),
            folders::parent_id.eq(updated_folder.parent_id),
        ))
        .execute(conn)?;

    Ok(updated_folder)
}

pub fn delete_folder(
    conn: &mut SqliteConnection,
    folder_id: i32,
) -> Result<usize, diesel::result::Error> {
    delete(folders::table.filter(folders::id.eq(folder_id))).execute(conn)
}
