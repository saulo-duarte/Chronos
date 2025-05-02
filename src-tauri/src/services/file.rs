use crate::models::NewFile;
use chrono::Local;
use mime_guess::MimeGuess;

pub fn prepare_new_file<'a>(
    name: &'a str,
    content: Option<&'a [u8]>,
    link: Option<&'a str>,
    folder_id: i32,
    is_favorite: bool,
) -> Result<NewFile<'a>, String> {
    let is_link = link.is_some();
    let is_file = content.map_or(false, |c| !c.is_empty());

    if !is_link && !is_file {
        return Err("You must provide either a file content or a valid link.".to_string());
    }

    let mime_type = MimeGuess::from_path(name).first_or_octet_stream().essence_str().to_string();

    Ok(NewFile {
        name,
        is_favorite,
        file_type: mime_type,
        link,
        content: content.unwrap_or(&[]),
        folder_id,
        created_at: Local::now().naive_local().to_string(),
        updated_at: None,
    })
}
