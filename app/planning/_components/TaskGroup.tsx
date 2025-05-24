
import type { Task } from "@/types/Task"
import { TaskItem } from "./TaskItem"
import { SubtaskList } from "./SubTaskList"
import { getTaskTypeIcon, getTaskTypeLabel, organizeTasksWithSubtasks } from "./TaskUtils"

interface TaskGroupProps {
  type: Task["type"]
  tasks: Task[]
}

export function TaskGroup({ type, tasks }: TaskGroupProps) {
  const organizedTasks = organizeTasksWithSubtasks(tasks)

  if (organizedTasks.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{getTaskTypeIcon(type)}</span>
        <h3 className="text-lg font-semibold">{getTaskTypeLabel(type)}</h3>
        <span className="text-sm text-muted-foreground">({tasks.length})</span>
      </div>

      <div className="space-y-3">
        {organizedTasks.map((task) => (
          <div key={task.id} className="space-y-2">
            <TaskItem task={task} />
            <SubtaskList subtasks={task.subtasks} />
          </div>
        ))}
      </div>
    </div>
  )
}
