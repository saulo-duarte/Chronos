"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTasks } from "@/hooks/useTaskSystem"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowLeft } from "lucide-react"
import { ImSpinner9 } from "react-icons/im"
import GroupedStudyTasks from "./_components/StudyTaskGroup"
import StudyTasksOverview from "./_components/StudyTaskOverview"
import AddTaskDialog from "../projects/_components/AddTaskDialog"
import { useWorkspace } from "../_hooks/useWorkspace"

export default function StudyTasksClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const subjectId = searchParams.get("categoryId")

  const {
    fetchTasksByCategoryId,
    handleDeleteTask,
    handleUpdateTask,
    allTasks,
    isLoading,
    error,
    handleAddMainTask,
  } = useTasks();

  const { fetchCategoryById, selectedCategory } = useWorkspace();

  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (subjectId) {
      fetchTasksByCategoryId(Number(subjectId))
      fetchCategoryById(Number(subjectId))
    }
  }, [subjectId])

  const openAddTaskDialog = () => {
    setIsAddTaskDialogOpen(true)
  }

  const handleGoBack = () => {
    router.push("/study")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ImSpinner9 className="animate-spin text-4xl text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-600 p-4">Error: {error}</p>
  }

  return (
    <div className="container p-4 h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleGoBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedCategory?.name || "Study Tasks"}
          </h1>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {selectedCategory?.status || "general"}
          </span>
        </div>
        <Button onClick={openAddTaskDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StudyTasksOverview
            tasks={allTasks}
            subjectId={subjectId ? parseInt(subjectId) : undefined}
          />
        </TabsContent>

        <TabsContent value="list" className="overflow-hidden">
          <GroupedStudyTasks
            tasks={allTasks}
            subjectId={subjectId ? parseInt(subjectId) : undefined}
            onDeleteTask={async (taskId) => {
              await handleDeleteTask(taskId)
            }}
            onUpdateTask={handleUpdateTask}
          />
        </TabsContent>
      </Tabs>

      <AddTaskDialog
        isOpen={isAddTaskDialogOpen}
        setIsOpen={setIsAddTaskDialogOpen}
        categoryId={subjectId ? parseInt(subjectId) : undefined}
        onSuccess={() => {
          if (subjectId) {
            fetchTasksByCategoryId(Number(subjectId))
          }
        }}
        onHandleAddTask={handleAddMainTask}
      />
    </div>
  )
}
