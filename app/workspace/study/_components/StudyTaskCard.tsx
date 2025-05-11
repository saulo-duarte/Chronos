"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Task } from '@/types/Task';
import { useTasks } from '@/hooks/useTaskSystem';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import TaskDropdownMenu from '../../projects/_components/TaskDropdownMenu';
import SubtasksList from '../../projects/_components/SubTaskLists';
import DeleteTaskDialog from '../../projects/_components/DeleteTaskDialog';
import AddSubtaskDialog from '../../projects/_components/AddSubTaskDialog';
import EditTaskDialog from '../../projects/_components/EditTaskDialog';

interface TaskCardProps {
  task: Task;
  subtasks: Task[];
  onDelete: (taskId: number) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
}

export default function StudyTaskCard({ task, subtasks, onDelete, onTaskUpdated }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddSubtaskDialogOpen, setIsAddSubtaskDialogOpen] = useState(false);
  const [localTask, setLocalTask] = useState<Task>(task);
  const [localSubtasks, setLocalSubtasks] = useState<Task[]>(subtasks);

  const {
    handleUpdateTask,
    handleAddSubtask,
    fetchTasksByCategoryId,
  } = useTasks();

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  useEffect(() => {
    setLocalSubtasks(subtasks);
  }, [subtasks]);

  useEffect(() => {
    if (localSubtasks?.length > 0) {
      console.log(`Task ${localTask.id} (${localTask.title}) subtasks updated:`, 
        localSubtasks.map(s => ({id: s.id, title: s.title, status: s.status})));
    }
  }, [localSubtasks, localTask]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const handleEditTask = async (
    taskId: number,
    title: string,
    description: string | null,
    subjectId: number | null,
    parentId: number | null,
    dueDate: string | null
  ) => {
    const success = await handleUpdateTask(
      taskId,
      title,
      description,
      subjectId,
      parentId,
      dueDate
    );
    
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setLocalTask(updatedTask);
    
    if (onTaskUpdated) {
      onTaskUpdated(updatedTask);
    }
  };

  const handleDeleteTaskConfirm = async (taskId: number) => {
    setIsDeleteDialogOpen(false);
    onDelete(taskId);
  };

  const handleAddSubtaskConfirm = async (newSubtask: {
    title: string;
    description: string | null;
    dueDate: string | null;
  }) => {
    if (!localTask.category_id) return;

    const success = await handleAddSubtask(localTask.id, localTask.category_id, newSubtask);
    if (success) {
      setIsAddSubtaskDialogOpen(false);
      
      const updatedTasks = await fetchTasksByCategoryId(localTask.category_id);
      if (updatedTasks) {
        const updatedSubtasks = updatedTasks.filter(task => task.parent_id === localTask.id);
        setLocalSubtasks(updatedSubtasks);
      }
    }
  };

  return (
    <Card className="w-full py-1">
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="w-full flex justify-between items-center">
          <h3 className="text-lg font-medium truncate mb-0">{localTask.title}</h3>
          <TaskDropdownMenu 
            task={localTask}
            onEdit={() => setIsEditDialogOpen(true)}
            onDelete={() => setIsDeleteDialogOpen(true)}
            onAddSubtask={() => setIsAddSubtaskDialogOpen(true)}
          />
        </div>
      </CardHeader>

      <CardContent className="pb-1">
        <p className="text-gray-500 text-sm line-clamp-2 -mt-6">
          {localTask.description || 'No description provided'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(localTask.due_date || '')}
          </div>
        </div>
      </CardContent>

      {localSubtasks.length > 0 && (
        <SubtasksList 
          subtasks={localSubtasks} 
          onSubtaskChanged={(updatedSubtasks) => {
            console.log('Subtasks changed in TaskCard:', updatedSubtasks.map(s => ({id: s.id, status: s.status})));
            setLocalSubtasks(updatedSubtasks);
          }}
        />
      )}

      {isEditDialogOpen && (
        <EditTaskDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          task={localTask}
          onUpdateTask={handleEditTask}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteTaskDialog
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          taskId={localTask.id}
          taskTitle={localTask.title}
          onDeleteTask={handleDeleteTaskConfirm}
        />
      )}

      {isAddSubtaskDialogOpen && (
        <AddSubtaskDialog
          open={isAddSubtaskDialogOpen}
          onClose={() => setIsAddSubtaskDialogOpen(false)}
          onAddSubtask={handleAddSubtaskConfirm}
          parentTaskTitle={localTask.title}
        />
      )}
    </Card>
  );
}
