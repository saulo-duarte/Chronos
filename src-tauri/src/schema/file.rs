use diesel::table;
use crate::schema::folders;

table! {
  files (id) {
      id -> Nullable<Integer>,
      name -> Text,
      is_favorite -> Bool,
      file_type -> Text,
      link -> Nullable<Text>,
      content -> Binary,
      folder_id -> Integer,
      created_at -> Timestamp,
      updated_at -> Nullable<Timestamp>,
  }
}

diesel::joinable!(files -> folders (folder_id));

diesel::allow_tables_to_appear_in_same_query!(
  folders,
  files,
);