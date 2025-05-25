export interface Task {
  id: number
  title: string
  description?: string | null
  status: string
  category_id: number | null
  parent_id?: number | null
  due_date?: string | null
  type: "project" | "study" | "event"
  last_recall?: string | null
  recalls?: string | null
  created_at: string
  updated_at?: string | null
}

export interface Category {
  id: number
  name: string
  color?: string
}

export interface TaskWithSubtasks extends Task {
  subtasks: Task[]
  isExpanded?: boolean
}

export interface DateFilter {
  startDate?: string
  endDate?: string
  withoutDate?: boolean
}

export interface TaskFilters {
  categoryId?: number | null
  dateFilter: DateFilter
  searchTerm?: string
  status?: "not_initialized" | "to_do" | "in_progress" | null
}
