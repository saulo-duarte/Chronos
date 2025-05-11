"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Task } from '@/types/Task';

export default function StudyTasksClient() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const result = await invoke('get_tasks_by_category_command', {
          categoryId: Number(categoryId),
        }) as Task[];
        setTasks(result);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [categoryId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Tasks for Study Category</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="border p-2 rounded">
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
