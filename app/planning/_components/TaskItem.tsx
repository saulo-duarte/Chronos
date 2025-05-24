"use client"
import type { TaskWithSubtasks } from "@/types/Task"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronDown, ChevronRight } from "lucide-react"
import { formatDate } from "./TaskUtils"

interface TaskItemProps {
  task: TaskWithSubtasks
  isSubtask?: boolean
  onToggleExpand?: (taskId: number) => void
}

export function TaskItem({ task, isSubtask = false, onToggleExpand }: TaskItemProps) {
  const hasSubtasks = task.subtasks.length > 0

  const handleToggleExpand = () => {
    if (hasSubtasks && onToggleExpand) {
      onToggleExpand(task.id)
    }
  }

  return (
    <div className="space-y-2">
      <Card
        className={`${isSubtask ? "ml-6 border-l-4 border-l-blue-200" : ""} hover:shadow-md transition-shadow ${
          hasSubtasks && !isSubtask ? "cursor-pointer" : ""
        }`}
        onClick={!isSubtask ? handleToggleExpand : undefined}
      >
        <CardContent className="px-4 py-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {hasSubtasks && !isSubtask && (
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6 shrink-0">
                  {task.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              )}

              <div className="min-w-0 flex-1">
                <h4 className={`${isSubtask ? "text-base" : "text-lg"} font-semibold truncate`}>{task.title}</h4>
                {task.description && <p className="text-sm text-muted-foreground truncate mt-1">{task.description}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {task.due_date && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span className="whitespace-nowrap">{formatDate(task.due_date)}</span>
                </div>
              )}

              {task.type === "study" && task.last_recall && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-" />
                  <span className="whitespace-nowrap">{formatDate(task.last_recall)}</span>
                </div>
              )}

              <Badge variant="outline" className="text-sm whitespace-nowrap">
                {task.status}
              </Badge>

              {hasSubtasks && !isSubtask && (
                <Badge variant="default" className="text-xs">
                  {task.subtasks.length}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSubtasks && task.isExpanded && (
        <div className="space-y-2">
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={{
                ...subtask,
                subtasks: "subtasks" in subtask && Array.isArray((subtask as any).subtasks)
                  ? (subtask as any).subtasks
                  : [],
              }}
              isSubtask
            />
          ))}
        </div>
      )}
    </div>
  )
}
