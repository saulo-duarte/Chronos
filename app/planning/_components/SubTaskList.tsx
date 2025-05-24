import type { Task } from "@/types/Task"
import { TaskItem } from "./TaskItem"

interface SubtaskListProps {
  subtasks: Task[]
}

export function SubtaskList({ subtasks }: SubtaskListProps) {
  if (subtasks.length === 0) return null

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground ml-2">Subtarefas ({subtasks.length})</h4>
      {subtasks.map((subtask) => (
        <TaskItem
          key={subtask.id}
          task={{ ...subtask, subtasks: (subtask as any).subtasks ?? [] }}
          isSubtask
        />
      ))}
    </div>
  )
}
