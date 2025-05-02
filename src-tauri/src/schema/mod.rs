diesel::table! {
   categories (id) {
       id -> Integer,
       name -> Text,
       description -> Nullable<Text>,
       #[sql_name = "type"]
       type_ -> Text,
       status -> Text,
       created_at -> Text,
       updated_at -> Nullable<Text>,
   }
}

diesel::table! {
   folders (id) {
       id -> Nullable<Integer>,
       name -> Text,
       path -> Text,
       created_at -> Timestamp,
       last_accessed -> Nullable<Timestamp>,
       parent_id -> Nullable<Integer>,
   }
}

diesel::table! {
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
   categories,
   folders,
   files,
);