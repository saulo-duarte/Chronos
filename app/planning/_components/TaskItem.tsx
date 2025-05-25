"use client"

import type { TaskWithSubtasks } from "@/types/Task"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronDown, ChevronRight, AlertCircle, Trash } from "lucide-react"
import { formatDate } from "./TaskUtils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreVertical } from "lucide-react"
import { useTasks } from "@/hooks/useTaskSystem"
import { useState } from "react"
import { EditTaskModal } from "./EditTaskModal"

interface TaskItemProps {
  task: TaskWithSubtasks
  isSubtask?: boolean
  onToggleExpand?: (taskId: number) => void
  onTaskUpdate?: (updatedTask: any) => void // Callback para atualizar a tarefa no componente pai
}

export function TaskItem({ task, isSubtask = false, onToggleExpand, onTaskUpdate }: TaskItemProps) {
  const hasSubtasks = task.subtasks.length > 0
  const { handleDeleteTask, handleUpdateTask, refreshTasks } = useTasks(false) // Adicionamos refreshTasks
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleExpand = () => {
    if (hasSubtasks && onToggleExpand) {
      onToggleExpand(task.id)
    }
  }

  const handleEditClick = async (taskId: number) => {
    try {
      setIsLoading(true)
      setSelectedTask(task)
      setEditModalOpen(true)
      
    } catch (error) {
      console.error('Erro ao preparar edição da tarefa:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = async (taskId: number) => {
    const confirmed = confirm("Tem certeza que deseja excluir esta tarefa?")
    if (confirmed) {
      await handleDeleteTask(taskId)
    }
  }

  function getStatusBadge(status: string) {
    const statusMap: Record<string, { label: string; color: string }> = {
      to_do: { label: "To Do", color: "bg-blue-500/80" },
      in_progress: { label: "In Progress", color: "bg-yellow-400/80" },
      not_initialized: { label: "Not Initialized", color: "bg-gray-500" },
    }

    const { label, color } = statusMap[status] || { label: status, color: "bg-muted" }

    return (
      <span className={`text-xs text-black px-2 py-0.5 rounded-md font-medium ${color}`}>
        {label}
      </span>
    )
  }

  const handleSaveTask = async (updatedData: {
    title: string
    description: string | null
    dueDate: string | null
  }) => {
    if (!selectedTask) return

    try {
      setIsLoading(true)
      
      const success = await handleUpdateTask(
        selectedTask.id,
        updatedData.title,
        updatedData.description,
        selectedTask.category_id,
        selectedTask.parent_id,
        updatedData.dueDate
      )

      if (success) {
        const updatedTask = {
          ...selectedTask,
          title: updatedData.title,
          description: updatedData.description,
          due_date: updatedData.dueDate,
        }
        
        if (onTaskUpdate) {
          onTaskUpdate(updatedTask)
        }
        
        setEditModalOpen(false)
        setSelectedTask(null)
        
        console.log('Tarefa atualizada com sucesso!')
      } else {
        console.error('Falha ao atualizar a tarefa')
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setEditModalOpen(false)
    setSelectedTask(null)
  }

  const isOverdue =
    !!task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "done";

  return (
    <>
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
                  <div className="flex items-center gap-2">
                    <h4 className={`${isSubtask ? "text-base" : "text-lg"} font-semibold truncate`}>
                      {task.title}
                    </h4>
                    {/* Status ao lado do título */}
                    {getStatusBadge(task.status)}
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted-foreground truncate mt-1">{task.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {task.due_date && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="whitespace-nowrap">{formatDate(task.due_date)}</span>

                    {isOverdue && (
                      <Badge className="text-xs flex items-center gap-1 ml-2 bg-red-600 text-red-950 border">
                        <AlertCircle className="w-3 h-3" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                )}

                {task.type === "study" && task.last_recall && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="whitespace-nowrap">{formatDate(task.last_recall)}</span>
                  </div>
                )}

                {hasSubtasks && !isSubtask && (
                  <Badge variant="default" className="text-xs">
                    {task.subtasks.length}
                  </Badge>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button  className="h-8 w-8 p-2 text-white rounded-md flex items-center justify-center hover:bg-gray-600/40 cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditClick(task.id)
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Edit"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(task.id)
                    }}
                    className="text-red-400"
                  >
                    <Trash className="mr-2 h-4 w-4 text-red-400" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                onToggleExpand={onToggleExpand}
                onTaskUpdate={onTaskUpdate}
              />
            ))}                       
          </div>
        )}
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && !isLoading && (
            <EditTaskModal
              task={selectedTask}
              onClose={handleCloseModal}
              onSave={handleSaveTask}
            />
          )}
          {isLoading && (
            <div className="p-4 text-center">
              <p>updating task...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}