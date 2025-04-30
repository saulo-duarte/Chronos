use chrono::Local;
use crate::models::NewFile;

pub fn prepare_new_file<'a>(
    name: &'a str,
    file_type: &'a str,
    content: &'a [u8],
    link: Option<&'a str>,
    folder_id: i32,
    is_favorite: bool,
) -> Result<NewFile<'a>, String> {
    if file_type == "Link" && link.is_none() {
        return Err("Link is required for file type 'Link'.".to_string());
    }

    if file_type != "Link" && content.is_empty() {
        return Err("File content cannot be empty.".to_string());
    }

    Ok(NewFile {
        name,
        is_favorite,
        file_type,
        link,
        content,
        folder_id,
        created_at: Local::now().naive_local().to_string(),
        updated_at: None,
    })
}
