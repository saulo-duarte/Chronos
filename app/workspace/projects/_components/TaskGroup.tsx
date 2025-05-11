'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TaskCard from './TaskCard';

interface GroupedTasksProps {
  tasks: Task[];
  categoryId?: number;
  onDeleteTask: (taskId: number) => Promise<void>;
  onUpdateTask: (
    taskId: number,
    title: string,
    description: string | null,
    categoryId: number | null,
    parentId: number | null,
    dueDate: string | null
  ) => Promise<boolean>;
}

interface TaskGroup {
  status: string;
  label: string;
  tasks: Task[];
}

const statusColors: Record<string, string> = {
  to_do: '#fbbf24',
  done: '#22c55e', // Changed from 'completed' to 'done'
  in_progress: '#3b82f6',
  backlog: '#9ca3af'
};

export default function GroupedTasks({
  tasks,
  categoryId,
  onDeleteTask,
  onUpdateTask,
}: GroupedTasksProps) {
  const normalizedTasks = tasks.map(task => {
    let status = (task.status || 'to_do').toLowerCase();
    
    if (status === 'not_initialized') status = 'to_do';
    // REMOVED: if (status === 'done') status = 'completed';
    // Keep 'done' as is since that's what backend expects
    
    return {
      ...task,
      status
    };
  });

  const [localTasks, setLocalTasks] = useState<Task[]>(normalizedTasks);

  useEffect(() => {
    console.log('Tasks received in TaskGroup:', tasks.map(t => ({ id: t.id, status: t.status })));
    setLocalTasks(normalizedTasks);
  }, [tasks]);

  const getGroupedTasks = (): TaskGroup[] => [
    {
      status: 'to_do',
      label: 'To Do',
      tasks: localTasks.filter(
        (task) => task.status === 'to_do' || task.status === 'pending'
      ),
    },
    {
      status: 'in_progress',
      label: 'In Progress',
      tasks: localTasks.filter((task) => task.status === 'in_progress'),
    },
    {
      status: 'done', // Changed from 'completed' to 'done'
      label: 'Completed',
      tasks: localTasks.filter((task) => task.status === 'done'), // Removed 'completed' to only use 'done'
    },
    {
      status: 'backlog',
      label: 'Backlog',
      tasks: localTasks.filter((task) => task.status === 'backlog'),
    },
  ];

  const [groups, setGroups] = useState<TaskGroup[]>(getGroupedTasks());

  useEffect(() => {
    setGroups(getGroupedTasks());
  }, [localTasks]);

  const [expandedGroups, setExpandedGroups] = useState<{
    [key: string]: boolean;
  }>({
    to_do: true,
    in_progress: true,
    done: false, // Changed from 'completed' to 'done'
    backlog: false,
  });

  const toggleGroup = (status: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleTaskDelete = (taskId: number) => {
    setLocalTasks(prev => prev.filter(task => task.id !== taskId && task.parent_id !== taskId));
    onDeleteTask(taskId);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setLocalTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <Card
          key={group.status}
          className="w-full bg-white/8 backdrop-blur-md border border-white/10 shadow-sm py-2" 
        >
          <CardHeader
            className="flex flex-row items-center justify-between p-4 py-2 cursor-pointer"
            onClick={() => toggleGroup(group.status)}
          >
            <div className="flex items-center space-x-2">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 rounded-full bg-white/20" />
                <div
                  className="absolute top-1 left-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColors[group.status] }}
                />
              </div>
        
              <h2
                className="text-lg font-semibold"
                style={{ color: statusColors[group.status] }}
              >
                {group.label}
              </h2>
        
              <span className="text-sm text-white/70 font-medium">
                ({group.tasks.filter((task) => !task.parent_id).length})
              </span>
            </div>
        
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto text-white/60 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                toggleGroup(group.status);
              }}
            >
              {expandedGroups[group.status] ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>
            {expandedGroups[group.status] && (
              <CardContent className="py-0">
                {group.tasks.filter(task => !task.parent_id).length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {group.tasks.filter(task => !task.parent_id).map((task) => {
                      const taskSubtasks = localTasks.filter((subtask) => subtask.parent_id === task.id);
                      
                      return (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          subtasks={taskSubtasks}
                          onDelete={() => handleTaskDelete(task.id)}
                          onTaskUpdated={handleTaskUpdated}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    No tasks in this category.
                  </p>
                )}
              </CardContent>
            )}
          </Card>
      ))}
    </div>
  );
}