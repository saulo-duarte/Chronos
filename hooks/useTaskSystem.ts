'use client';

import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Task } from '@/types/Task';

export function useTasks(autoLoad = true) {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);

  const fetchAllTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await invoke('get_all_tasks_command') as Task[];
      setAllTasks(result);
      setError(null);
      return result;
    } catch (err) {
      setError(`Error loading tasks: ${err}`);
      console.error('Error loading tasks:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTasksByCategoryId = useCallback(async (categoryId: number) => {
    try {
      setIsLoading(true);
      const result = await invoke('get_tasks_by_category_id_command', { categoryId }) as Task[];
      setAllTasks(result);
      setCurrentCategoryId(categoryId);
      setError(null);
      return result;
    } catch (err) {
      setError(`Error loading tasks by category: ${err}`);
      console.error('Error loading tasks by category:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    if (currentCategoryId !== null) {
      return await fetchTasksByCategoryId(currentCategoryId);
    } else {
      return await fetchAllTasks();
    }
  }, [currentCategoryId, fetchAllTasks, fetchTasksByCategoryId]);

  useEffect(() => {
    if (autoLoad) {
      fetchAllTasks();
    }
  }, [autoLoad, fetchAllTasks]);

  const handleAddMainTask = async (task: {
    title: string;
    description: string | null;
    categoryId: number | null;
    parentId: number | null;
    dueDate: string | null;
  }) => {
    try {
      const newTask = await invoke('add_task_command', task) as Task;
      
      setAllTasks(prevTasks => [...prevTasks, newTask]);
      
      await refreshTasks();
      return true;
    } catch (err) {
      setError(`Error adding task: ${err}`);
      console.error('Error adding task:', err);
      return false;
    }
  };

  const handleAddSubtask = async (
    parentId: number,
    categoryId: number,
    subtask: {
      title: string;
      description: string | null;
      dueDate: string | null;
    }
  ) => {
    try {
      const payload = {
        title: subtask.title,
        description: subtask.description,
        categoryId,
        parentId,
        dueDate: subtask.dueDate || null,
      };
      const newSubtask = await invoke('add_task_command', payload) as Task;
      
      setAllTasks(prevTasks => [...prevTasks, newSubtask]);
      
      const refreshedTasks = await refreshTasks();
      return true;
    } catch (err) {
      setError(`Error adding subtask: ${err}`);
      console.error('Error adding subtask:', err);
      return false;
    }
  };

  const handleUpdateTask = async (
    taskId: number,
    title: string,
    description: string | null,
    categoryId: number | null,
    parentId: number | null,
    dueDate: string | null
  ): Promise<boolean> => {
    try {
      const updatedTask = await invoke('update_task_command', {
        taskId,
        title,
        description,
        categoryId,
        parentId,
        dueDate,
      }) as Task;
      
      setAllTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      
      await refreshTasks();
      return true;
    } catch (err) {
      setError(`Error updating task: ${err}`);
      console.error('Error updating task:', err);
      return false;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await invoke('delete_task_command', { taskId });
      
      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      setSelectedTask(prev => (prev?.id === taskId ? null : prev));
      
      await refreshTasks();
      return true;
    } catch (err) {
      setError(`Error deleting task: ${err}`);
      console.error('Error deleting task:', err);
      return false;
    }
  };

  const handleChangeTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const updatedTask = await invoke('update_task_status_command', { taskId, newStatus }) as Task;
      
      setAllTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? {...task, status: newStatus} : task)
      );
      
      await refreshTasks();
      return true;
    } catch (err) {
      setError(`Error updating task status: ${err}`);
      console.error('Error updating task status:', err);
      return false;
    }
  };

  const handleChangeCompleteTask = async (taskId: number) => {
    return handleChangeTaskStatus(taskId, 'completed');
  };

  const fetchTaskById = async (taskId: number) => {
    try {
      setIsLoading(true);
      const result = await invoke('get_task_by_id_command', { taskId }) as Task;
      setSelectedTask(result);
      setError(null);
      return result;
    } catch (err) {
      setError(`Error loading task: ${err}`);
      console.error('Error loading task:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const selectTask = (task: Task) => setSelectedTask(task);
  const clearSelectedTask = () => setSelectedTask(null);

  return {
    allTasks,
    selectedTask,
    isLoading,
    error,
    fetchAllTasks,
    fetchTaskById,
    fetchTasksByCategoryId,
    refreshTasks,
    handleAddMainTask,
    handleAddSubtask,
    handleUpdateTask,
    handleDeleteTask,
    handleChangeTaskStatus,
    handleChangeCompleteTask,
    selectTask,
    clearSelectedTask,
  };
}