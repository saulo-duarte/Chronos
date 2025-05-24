"use client"

import { TaskList } from "./_components/TaskList"
import type { Task } from "@/types/Task"
import { invoke } from "@tauri-apps/api/core"
import type { Category } from "@/types/Category"

export default function Home() {                                                                
  const fetchPendingTasks = async () => {
    try {
      const result = (await invoke("get_pending_tasks_command")) as Task[]
      return result
    } catch (err) {
      console.error("Error loading pending tasks:", err)
      return null
    }
  }

  const fetchCategories = async () => {
    try {
      const result = (await invoke("get_all_categories_command")) as Category[]
      return result
    } catch (err) {
      console.error("Error loading categories:", err)
      return null
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <TaskList fetchPendingTasks={fetchPendingTasks} fetchCategories={fetchCategories} />
    </main>
  )
}

