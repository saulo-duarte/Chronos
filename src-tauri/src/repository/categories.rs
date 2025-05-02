use crate::models::{NewCategory, Category};
use diesel::prelude::*;
use diesel::result::Error;

pub fn create_category<'a>(conn: &mut SqliteConnection, new_category: NewCategory<'a>) -> Result<Category, Error> {
    use crate::schema::categories::dsl::*;

    diesel::insert_into(categories)
        .values(&new_category)
        .execute(conn)?;

    categories.order(id.desc()).first(conn)
}

pub fn get_category_by_id(conn: &mut SqliteConnection, category_id: i32) -> Result<Category, Error> {
   use crate::schema::categories::dsl::*;

   categories.filter(id.eq(category_id))
       .first(conn)
}

pub fn get_all_categories(conn: &mut SqliteConnection) -> Result<Vec<Category>, Error> {
   use crate::schema::categories::dsl::*;

   categories.order(created_at.desc())
       .load(conn)
}

pub fn update_category<'a>(conn: &mut SqliteConnection, category_id: i32, updated_category: NewCategory<'a>) -> Result<Category, Error> {
   use crate::schema::categories::dsl::*;

   diesel::update(categories.filter(id.eq(category_id)))
       .set((
           name.eq(updated_category.name),
           description.eq(updated_category.description),
           type_.eq(updated_category.type_),
           status.eq(updated_category.status),
           updated_at.eq(updated_category.updated_at),
       ))
       .execute(conn)?;

   categories.filter(id.eq(category_id)).first(conn)
}

pub fn delete_category(conn: &mut SqliteConnection, category_id: i32) -> Result<usize, Error> {
   use crate::schema::categories::dsl::*;

   diesel::delete(categories.filter(id.eq(category_id)))
       .execute(conn)
}

