import type { Task, TaskWithSubtasks, TaskFilters } from "@/types/Task"
import { FaProjectDiagram } from "react-icons/fa"
import { BookOpen, Calendar } from "lucide-react"

export const organizeTasksWithSubtasks = (tasks: Task[]): TaskWithSubtasks[] => {
  const taskMap = new Map<number, TaskWithSubtasks>()
  const parentTasks: TaskWithSubtasks[] = []

  tasks.forEach((task) => {
    taskMap.set(task.id, { ...task, subtasks: [], isExpanded: false })
  })

  tasks.forEach((task) => {
    const taskWithSubtasks = taskMap.get(task.id)!

    if (task.parent_id) {
      const parent = taskMap.get(task.parent_id)
      if (parent) {
        parent.subtasks.push(taskWithSubtasks)
      }
    } else {
      parentTasks.push(taskWithSubtasks)
    }
  })

  return parentTasks
}

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter((task) => {
    if (filters.categoryId !== undefined && filters.categoryId !== null) {
      if (task.category_id !== filters.categoryId) {
        return false
      }
    }

    const { startDate, endDate, withoutDate } = filters.dateFilter

    if (withoutDate) {
      return !task.due_date
    }

    if (startDate || endDate) {
      if (!task.due_date) return false

      const taskDate = new Date(task.due_date)

      if (startDate && taskDate < new Date(startDate)) {
        return false
      }

      if (endDate && taskDate > new Date(endDate)) {
        return false
      }
    }

    if (filters.status) {
      if (task.status !== filters.status) {
        return false
      }
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      return task.title.toLowerCase().includes(searchLower) ||
             task.description?.toLowerCase().includes(searchLower)
    }

    return true
  })
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toISOString().split("T")[0]
}

export const getTaskTypeIcon = (type: string) => {
  switch (type) {
    case "project":
      return <FaProjectDiagram className="w-5 h-5" />
    case "study":
      return <BookOpen className="w-5 h-5" />
    case "event":
      return <Calendar className="w-5 h-5" />
    default:
      return null
  }
}

export const getTaskTypeLabel = (type: string) => {
  switch (type) {
    case "project":
      return "Projetos"
    case "study":
      return "Estudos"
    case "event":
      return "Eventos"
    default:
      return "Tarefas"
  }
}
