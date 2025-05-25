"use client"

import { useState, useEffect, useMemo } from "react"
import type { Task, Category, TaskFilters, TaskWithSubtasks } from "@/types/Task"
import { TaskItem } from "./TaskItem"
import { TaskFilters as TaskFiltersComponent } from "./TasksFilters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { FaProjectDiagram } from "react-icons/fa"
import { BookOpen, Calendar } from "lucide-react"
import { organizeTasksWithSubtasks, filterTasks } from "./TaskUtils"
import { AddEventButton } from "./EventModal"

interface TaskListProps {
  fetchPendingTasks: () => Promise<Task[] | null>
  fetchCategories: () => Promise<Category[] | null>
}

export function TaskList({ fetchPendingTasks, fetchCategories }: TaskListProps) {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set())
  const [filters, setFilters] = useState<TaskFilters>({
    categoryId: null,
    dateFilter: {},
    searchTerm: "",
    status: null,
  })

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [tasks, categoriesData] = await Promise.all([fetchPendingTasks(), fetchCategories()])

      if (tasks) setAllTasks(tasks)
      if (categoriesData) setCategories(categoriesData)
    } catch (err) {
      setError(`Erro ao carregar dados: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleExpand = (taskId: number) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    setAllTasks(prevTasks => {
      const updateTaskRecursively = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task.id === updatedTask.id) {
            return { ...task, ...updatedTask }
          }
          
          if ('subtasks' in task && Array.isArray((task as any).subtasks)) {
            const updatedSubtasks = updateTaskRecursively((task as any).subtasks)
            return { ...task, subtasks: updatedSubtasks }
          }
          
          return task
        })
      }

      return updateTaskRecursively(prevTasks)
    })
  }

  const filteredTasks = useMemo(() => {
    return filterTasks(allTasks, filters)
  }, [allTasks, filters])

  const tasksByType = useMemo(() => {
    const organized = organizeTasksWithSubtasks(filteredTasks)

    const updatedTasks = organized.map((task) => ({
      ...task,
      isExpanded: expandedTasks.has(task.id),
      subtasks: task.subtasks.map((subtask) => ({
        ...subtask,
        isExpanded: expandedTasks.has(subtask.id),
      })),
    }))

    return {
      project: updatedTasks.filter((task) => task.type === "project"),
      study: updatedTasks.filter((task) => task.type === "study"),
      event: updatedTasks.filter((task) => task.type === "event"),
    }
  }, [filteredTasks, expandedTasks])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FaProjectDiagram className="w-4 h-4" />
      case "study":
        return <BookOpen className="w-4 h-4" />
      case "event":
        return <Calendar className="w-4 h-4" />
      default:
        return null
    }
  }

  const renderTaskList = (tasks: TaskWithSubtasks[]) => {
    if (tasks.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">Nenhuma tarefa encontrada.</div>
    }

    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggleExpand={handleToggleExpand}
            onTaskUpdate={handleTaskUpdate}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading Tasks...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-2">
      <Card className="bg-background border-0">
        <CardHeader className="flex justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-3xl font-semibold">
            Pending Tasks
            <span className="text-lg font-normal text-foreground">
              ({filteredTasks.length} de {allTasks.length})
            </span>
          </CardTitle>
          <AddEventButton />
        </CardHeader>

        <CardContent className="space-y-4 mt-0">
          <Tabs defaultValue="project" className="w-full">
            <div className="flex items-center justify-between gap-2 w-full">
                <TabsList className="flex gap-1 p-1 rounded-lg">
                  <TabsTrigger value="project" className="flex items-center gap-2 px-3 py-2">
                    {getTypeIcon("project")}
                    <span className="hidden sm:block">Projects</span>
                    <span className="sm:hidden">Proj</span>
                    <span className="text-xs opacity-70">({tasksByType.project.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="study" className="flex items-center gap-2 px-3 py-2">
                    {getTypeIcon("study")}
                    <span className="hidden sm:block">Study</span>
                    <span className="sm:hidden">Est</span>
                    <span className="text-xs opacity-70">({tasksByType.study.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="event" className="flex items-center gap-2 px-3 py-2">
                    {getTypeIcon("event")}
                    <span className="hidden sm:block">Events</span>
                    <span className="sm:hidden">Ev</span>
                    <span className="text-xs opacity-70">({tasksByType.event.length})</span>
                  </TabsTrigger>
                </TabsList>
              </div>

                <TaskFiltersComponent 
                  categories={categories} 
                  filters={filters} 
                  onFiltersChange={setFilters}
                />

            <TabsContent value="project" className="mt-6">
              {renderTaskList(tasksByType.project)}
            </TabsContent>

            <TabsContent value="study" className="mt-6">
              {renderTaskList(tasksByType.study)}
            </TabsContent>

            <TabsContent value="event" className="mt-6">
              {renderTaskList(tasksByType.event)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}