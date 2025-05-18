import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskItem } from "./TaskItem"
import type { Task } from "@/types/Task"

interface TaskWithSubtasks extends Task {
  subtasks?: Task[]
  isExpanded?: boolean
}

interface TaskListProps {
  title: string
  icon: React.ReactNode
  tasks: TaskWithSubtasks[]
  isLoading: boolean
  expandedTaskIds: Set<number>
  onToggleExpand: (taskId: number) => void
  onSelectTask: (task: Task) => void
  onCompleteTask: (taskId: number) => void
  emptyMessage?: string
}

export function TaskList({
  title,
  icon,
  tasks,
  isLoading,
  expandedTaskIds,
  onToggleExpand,
  onSelectTask,
  onCompleteTask,
  emptyMessage = "Nenhuma tarefa encontrada.",
}: TaskListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon} {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              expandedTaskIds={expandedTaskIds}
              onToggleExpand={onToggleExpand}
              onSelectTask={onSelectTask}
              onCompleteTask={onCompleteTask}
            />
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground">{emptyMessage}</div>
        )}
      </CardContent>
    </Card>
  )
}
