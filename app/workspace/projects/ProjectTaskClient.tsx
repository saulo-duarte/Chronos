"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTaskSystem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { ImSpinner9 } from 'react-icons/im';
import GroupedTasks from './_components/TaskGroup';
import TasksOverview from './_components/TaskOverview';
import AddTaskDialog from './_components/AddTaskDialog';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '../_hooks/useWorkspace';

export default function ProjectTasksClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('categoryId');
  const {
    fetchTasksByCategoryId,
    handleDeleteTask,
    handleUpdateTask,
    allTasks,
    isLoading,
    error,
    handleAddMainTask,
  } = useTasks(false);

  const { fetchCategoryById, selectedCategory } = useWorkspace();

  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (categoryId) {
      fetchTasksByCategoryId(Number(categoryId));
      fetchCategoryById(Number(categoryId));
    }
  }, [categoryId]);

  const openAddTaskDialog = () => {
    setIsAddTaskDialogOpen(true);
  };

  const handleGoBack = () => {
    router.push('/workspace');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ImSpinner9 className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 p-4">Error: {error}</p>;
  }

  return (
    <div className="container h-screen p-4 h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleGoBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedCategory?.name || 'Project Tasks'}
          </h1>
          <span className="bg-blue-600/30 text-sm font-medium text-blue-400 px-2.5 py-0.5 rounded-lg">
            {selectedCategory?.status || 'unknown'}
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
          <TasksOverview
            tasks={allTasks}
            categoryId={categoryId ? parseInt(categoryId) : undefined}
          />
        </TabsContent>

        <TabsContent value="list" className='overflow-hidden'>
          <GroupedTasks
            tasks={allTasks}
            categoryId={categoryId ? parseInt(categoryId) : undefined}
            onDeleteTask={async (taskId) => {
              await handleDeleteTask(taskId);
            }}
            onUpdateTask={handleUpdateTask}
          />
        </TabsContent>
      </Tabs>

      <AddTaskDialog
        isOpen={isAddTaskDialogOpen}
        setIsOpen={setIsAddTaskDialogOpen}
        categoryId={categoryId ? parseInt(categoryId) : undefined}
        onSuccess={() => {
          if (categoryId) {
            fetchTasksByCategoryId(Number(categoryId));
          }
        }}
        onHandleAddTask={handleAddMainTask}
      />
    </div>
  );
}