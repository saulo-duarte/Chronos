"use client"

import { useEffect, useState, useCallback } from "react"
import { parseISO, isValid as isValidDate } from "date-fns"
import { Calendar, CheckCircle2, ListFilter, X } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTasks } from "@/hooks/useTaskSystem"
import type { Task } from "@/types/Task"
import { TaskList } from "./TaskList"
import { TaskFilters } from "./TaskFilters"

// Tipagens dos filtros
type TaskType = "project" | "study" | "event"
type TaskStatus = "not_initialized" | "pending" | "in_progress" | "done"

interface TaskWithSubtasks extends Task {
  subtasks?: Task[]
  isExpanded?: boolean
}

export default function PendingTasksList() {
  const { allTasks, isLoading, error, fetchPendingTasks, handleChangeCompleteTask, selectTask } = useTasks()

  const [tasksWithDate, setTasksWithDate] = useState<TaskWithSubtasks[]>([])
  const [tasksWithoutDate, setTasksWithoutDate] = useState<TaskWithSubtasks[]>([])
  const [allProcessedTasks, setAllProcessedTasks] = useState<TaskWithSubtasks[]>([])
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [filters, setFilters] = useState({
    types: {
      project: true,
      study: true,
      event: true,
    },
    status: {
      not_initialized: true,
      pending: true,
      in_progress: true,
      done: false,
    },
  })

  const refreshTasks = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await fetchPendingTasks()
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchPendingTasks])

  useEffect(() => {
    if (!isLoading && (!allTasks || allTasks.length === 0)) {
      fetchPendingTasks()
    }
  }, [])

  useEffect(() => {
    if (!allTasks) return

    const mainTasks = allTasks.filter((task) => !task.parent_id)
    const subtasks = allTasks.filter((task) => task.parent_id)

    const tasksWithSubtasksMap: TaskWithSubtasks[] = mainTasks.map((mainTask) => {
      const taskSubtasks = subtasks.filter((subtask) => subtask.parent_id === mainTask.id)
      return {
        ...mainTask,
        subtasks: taskSubtasks,
        isExpanded: expandedTaskIds.has(mainTask.id),
      }
    })

    const filteredTasks = tasksWithSubtasksMap.filter((task) => {
      return (
        filters.types[task.type] &&
        filters.status[task.status as TaskStatus]
      )
    })

    const withDate: TaskWithSubtasks[] = []
    const withoutDate: TaskWithSubtasks[] = []

    filteredTasks.forEach((task) => {
      if (task.due_date) {
        const parsed = parseISO(task.due_date)
        if (isValidDate(parsed)) {
          withDate.push(task)
        } else {
          withoutDate.push(task)
        }
      } else {
        withoutDate.push(task)
      }
    })

    withDate.sort((a, b) => {
      if (a.due_date && b.due_date) {
        return parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime()
      }
      return 0
    })

    setTasksWithDate(withDate)
    setTasksWithoutDate(withoutDate)
    setAllProcessedTasks(filteredTasks)
  }, [allTasks, expandedTaskIds, filters])

  const toggleFilter = (filterType: "types" | "status", key: TaskType | TaskStatus) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [key]: !prev[filterType][key],
      },
    }))
  }

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTaskIds((prev) => {
      const newSet = new Set(prev)
      newSet.has(taskId) ? newSet.delete(taskId) : newSet.add(taskId)
      return newSet
    })
  }

  const handleCompleteTask = (taskId: number) => {
    handleChangeCompleteTask(taskId)
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <X className="h-5 w-5" /> Erro ao carregar tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={refreshTasks}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tarefas Pendentes</h2>
        <TaskFilters
          filters={filters}
          onToggleFilter={toggleFilter}
          onRefresh={refreshTasks}
          isRefreshing={isRefreshing}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            <ListFilter className="h-4 w-4 mr-2" />
            Todas ({allProcessedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="with-date">
            <Calendar className="h-4 w-4 mr-2" />
            Com Data ({tasksWithDate.length})
          </TabsTrigger>
          <TabsTrigger value="without-date">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Sem Data ({tasksWithoutDate.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <TaskList
            title="Todas as Tarefas"
            icon={<ListFilter className="h-5 w-5" />}
            tasks={allProcessedTasks}
            isLoading={isLoading}
            expandedTaskIds={expandedTaskIds}
            onToggleExpand={toggleTaskExpansion}
            onSelectTask={selectTask}
            onCompleteTask={handleCompleteTask}
            emptyMessage="Nenhuma tarefa encontrada com os filtros atuais."
          />
        </TabsContent>

        <TabsContent value="with-date" className="mt-4">
          <TaskList
            title="Tarefas com Data"
            icon={<Calendar className="h-5 w-5" />}
            tasks={tasksWithDate}
            isLoading={isLoading}
            expandedTaskIds={expandedTaskIds}
            onToggleExpand={toggleTaskExpansion}
            onSelectTask={selectTask}
            onCompleteTask={handleCompleteTask}
            emptyMessage="Nenhuma tarefa com data encontrada."
          />
        </TabsContent>

        <TabsContent value="without-date" className="mt-4">
          <TaskList
            title="Tarefas sem Data"
            icon={<CheckCircle2 className="h-5 w-5" />}
            tasks={tasksWithoutDate}
            isLoading={isLoading}
            expandedTaskIds={expandedTaskIds}
            onToggleExpand={toggleTaskExpansion}
            onSelectTask={selectTask}
            onCompleteTask={handleCompleteTask}
            emptyMessage="Nenhuma tarefa sem data encontrada."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
