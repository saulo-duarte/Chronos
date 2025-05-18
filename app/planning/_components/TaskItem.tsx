"use client"

import { format, parseISO, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, ChevronDown, ChevronUp, Clock, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/Task"

interface TaskWithSubtasks extends Task {
  subtasks?: Task[]
  isExpanded?: boolean
}

interface TaskItemProps {
  task: TaskWithSubtasks
  isSubtask?: boolean
  onToggleExpand: (taskId: number) => void
  onSelectTask: (task: Task) => void
  onCompleteTask: (taskId: number) => void
  expandedTaskIds: Set<number>
}

export function TaskItem({
  task,
  isSubtask = false,
  onToggleExpand,
  onSelectTask,
  onCompleteTask,
  expandedTaskIds,
}: TaskItemProps) {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0
  const isExpanded = expandedTaskIds.has(task.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
      case "in_progress":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50"
      case "done":
        return "bg-green-500/20 text-green-500 border-green-500/50"
      case "not_initialized":
        return "bg-purple-500/20 text-purple-500 border-purple-500/50"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50"
    }
  }

  const getTypeIcon = (type: "project" | "study" | "event") => {
    switch (type) {
      case "project":
        return <Layers className="h-4 w-4" />
      case "study":
        return <Calendar className="h-4 w-4" />
      case "event":
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null

    try {
      const date = parseISO(dateString)
      if (!isValid(date)) return null

      return format(date, "dd 'de' MMMM", { locale: ptBR })
    } catch (error) {
      return null
    }
  }

  return (
    <div className={cn("mb-2", isSubtask ? "ml-6 mt-2" : "")}>
      <div
        className={cn(
          "p-3 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors",
          isSubtask ? "border-dashed" : "",
        )}
        onClick={() => onSelectTask(task)}
      >
        <div className="flex items-start gap-2">
          <Checkbox
            checked={task.status === "done"}
            onCheckedChange={() => onCompleteTask(task.id)}
            className="mt-1"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="font-medium line-clamp-2">{task.title}</div>

              <div className="flex items-center gap-2 ml-2 shrink-0">
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {task.status === "pending"
                    ? "Pending"
                    : task.status === "in_progress"
                      ? "In Progress"
                      : task.status === "not_initialized"
                        ? "Not Initialized"
                        : "Concluída"}
                </Badge>

                <Badge variant="outline" className="bg-card">
                  <span className="flex items-center gap-1">
                    {getTypeIcon(task.type)}
                    {task.type === "project" ? "Projeto" : task.type === "study" ? "Estudo" : "Evento"}
                  </span>
                </Badge>

                {hasSubtasks && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpand(task.id)
                    }}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>

            {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}

            {task.due_date && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(task.due_date)}
              </div>
            )}
          </div>
        </div>
      </div>

      {hasSubtasks && isExpanded && (
        <div className="border-l-2 border-border pl-2 mt-1">
          {task.subtasks?.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              isSubtask={true}
              onToggleExpand={onToggleExpand}
              onSelectTask={onSelectTask}
              onCompleteTask={onCompleteTask}
              expandedTaskIds={expandedTaskIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}
