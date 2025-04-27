use diesel::table;

table! {
    folders (id) {
        id -> Nullable<Integer>,
        name -> Text,
        path -> Text,
        created_at -> Timestamp,
        last_accessed -> Nullable<Timestamp>,
        parent_id -> Nullable<Integer>,
    }
}
