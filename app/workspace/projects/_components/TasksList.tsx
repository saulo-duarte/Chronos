'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '@/hooks/useTaskSystem';
import TaskCard from './TaskCard';
import EmptyTasksView from './EmptyTaskView';
import { Task } from '@/types/Task';

interface TasksListProps {
  categoryId?: number;
}

export default function TasksList({ categoryId }: TasksListProps) {
  const {
    allTasks,
    isLoading,
    fetchAllTasks,
    fetchTasksByCategoryId
  } = useTasks(true);
  
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    setLocalTasks(allTasks);
  }, [allTasks]);

  useEffect(() => {
    const loadTasks = async () => {
      if (categoryId) {
        await fetchTasksByCategoryId(categoryId);
      } else {
        await fetchAllTasks();
      }
    };
    
    loadTasks();
  }, [categoryId, fetchAllTasks, fetchTasksByCategoryId]);

  const handleTaskDelete = (taskId: number) => {
    setLocalTasks(prev => prev.filter(task => task.id !== taskId && task.parent_id !== taskId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (localTasks.length === 0) {
    return <EmptyTasksView />;
  }

  const subtasksMap = localTasks.reduce((acc, task) => {
    if (task.parent_id) {
      const parentId = task.parent_id;
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(task);
    }
    return acc;
  }, {} as Record<number, Task[]>);

  const mainTasks = localTasks.filter((task) => !task.parent_id);

  return (
    <div className="grid grid-cols-1 gap-4">
      {mainTasks.map((task) => {
        const taskSubtasks = subtasksMap[task.id] || [];
        
        return (
          <TaskCard 
            key={task.id} 
            task={task} 
            subtasks={taskSubtasks}
            onDelete={() => handleTaskDelete(task.id)}
          />
        );
      })}
    </div>
  );
}