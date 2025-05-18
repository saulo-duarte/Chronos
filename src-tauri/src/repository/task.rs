use diesel::prelude::*;
use crate::models::{Task, NewTask, UpdateTaskData};
use crate::schema::tasks::dsl::*;
use diesel::result::Error as DieselError;

pub struct TaskRepository;

impl TaskRepository {
    pub fn create(conn: &mut SqliteConnection, new_task: &NewTask) -> Result<Task, DieselError> {
        diesel::insert_into(tasks)
            .values(new_task)
            .execute(conn)?;

        tasks.order(id.desc()).first(conn)
    }

    pub fn get_tasks_by_category_id(
        conn: &mut SqliteConnection,
        category_id_value: i32,
    ) -> Result<Vec<Task>, DieselError> {
        tasks.filter(category_id.eq(category_id_value)).load(conn)
    }

    pub fn get_by_id(conn: &mut SqliteConnection, task_id: i32) -> Result<Task, DieselError> {
        tasks.filter(id.eq(task_id)).first(conn)
    }

    pub fn list(conn: &mut SqliteConnection) -> Result<Vec<Task>, DieselError> {
        tasks.order(created_at.desc()).load(conn)
    }

    pub fn delete(conn: &mut SqliteConnection, task_id: i32) -> Result<usize, DieselError> {
        diesel::delete(tasks.filter(id.eq(task_id))).execute(conn)
    }

    pub fn update_status(
        conn: &mut SqliteConnection,
        task_id_value: i32,
        new_status_value: &str,
    ) -> Result<(), DieselError> {
        diesel::update(tasks.filter(id.eq(task_id_value)))
            .set(status.eq(new_status_value))
            .execute(conn)?;

        Ok(())
    }

    pub fn set_done(
        conn: &mut SqliteConnection,
        task_id_value: i32,
        done: bool,
    ) -> Result<(), DieselError> {
        diesel::update(tasks.filter(id.eq(task_id_value)))
            .set(status.eq(if done { "done" } else { "in_progress" }))
            .execute(conn)?;

        Ok(())
    }

    pub fn update_recall_info(
        conn: &mut SqliteConnection,
        task_id_value: i32,
        new_last_recall: Option<&str>,
        new_recalls: Option<&str>,
    ) -> Result<(), DieselError> {
        diesel::update(tasks.filter(id.eq(task_id_value)))
            .set((
                last_recall.eq(new_last_recall),
                recalls.eq(new_recalls),
            ))
            .execute(conn)?;

        Ok(())
    }

    pub fn get_pending_tasks(
        conn: &mut SqliteConnection
    ) -> Result<Vec<Task>, DieselError> {
        tasks.filter(status.ne("done")).load(conn)
    }

    pub fn update_task(
        conn: &mut SqliteConnection,
        task_id_value: i32,
        data: UpdateTaskData,
    ) -> Result<Task, DieselError> {
        diesel::update(tasks.filter(id.eq(task_id_value)))
            .set(data)
            .execute(conn)?;

        tasks.filter(id.eq(task_id_value)).first(conn)
    }
}
