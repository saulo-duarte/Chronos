'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { useTasks } from '@/hooks/useTaskSystem';
import {
  Circle,
  CheckCircle2,
} from 'lucide-react';
import SubtaskDropdownMenu from './SubTaskDropdownMenu';
import DeleteTaskDialog from './DeleteTaskDialog';
import EditTaskDialog from './EditTaskDialog';

interface SubtasksListProps {
  subtasks: Task[];
  onSubtaskChanged?: (updatedSubtasks: Task[]) => void;
}

export default function SubtasksList({ subtasks, onSubtaskChanged }: SubtasksListProps) {
  const [selectedSubtask, setSelectedSubtask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localSubtasks, setLocalSubtasks] = useState<Task[]>(subtasks);
  
  const { handleChangeTaskStatus, handleUpdateTask, handleDeleteTask } = useTasks(false);

  useEffect(() => {
    setLocalSubtasks(subtasks);
  }, [subtasks]);

  // Keep debug console log to check status values
  useEffect(() => {
    console.log('Current subtasks with statuses:', localSubtasks.map(t => ({ id: t.id, title: t.title, status: t.status })));
  }, [localSubtasks]);

  const toggleSubtaskComplete = async (taskId: number, currentStatus: string) => {
    // Keep as 'done'/'to_do' since that's what backend expects
    const newStatus = currentStatus.toLowerCase() === 'done' ? 'to_do' : 'done';
    console.log(`Toggling task ${taskId} from ${currentStatus} to ${newStatus}`);
    
    const success = await handleChangeTaskStatus(taskId, newStatus);
    console.log(`Status update success: ${success}`);
    
    if (success) {
      // Immediately update local state to reflect change
      const updatedSubtasks = localSubtasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      
      console.log('Updated local subtasks:', updatedSubtasks.map(t => ({ id: t.id, status: t.status })));
      setLocalSubtasks(updatedSubtasks);
      
      if (onSubtaskChanged) {
        onSubtaskChanged(updatedSubtasks);
      }
    }
  };

  const handleEditSubtask = async (
    taskId: number,
    title: string,
    description: string | null,
    categoryId: number | null,
    parentId: number | null,
    dueDate: string | null
  ) => {
    const success = await handleUpdateTask(taskId, title, description, categoryId, parentId, dueDate);
    
    if (success && selectedSubtask) {
      const updatedSubtasks = localSubtasks.map(task => 
        task.id === taskId ? { 
          ...task, 
          title, 
          description, 
          category_id: categoryId, 
          parent_id: parentId, 
          due_date: dueDate 
        } : task
      );
      setLocalSubtasks(updatedSubtasks);
      
      if (onSubtaskChanged) {
        onSubtaskChanged(updatedSubtasks);
      }
      
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteSubtaskConfirm = async (taskId: number) => {
    const success = await handleDeleteTask(taskId);
    
    if (success) {
      const updatedSubtasks = localSubtasks.filter(task => task.id !== taskId);
      setLocalSubtasks(updatedSubtasks);
      
      if (onSubtaskChanged) {
        onSubtaskChanged(updatedSubtasks);
      }
      
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="border-t border-white/10 -mt-2 pt-2 px-4">
      <h4 className="text-sm font-medium text-foreground mb-2">Subtasks</h4>
      {localSubtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center mb-2 bg-card rounded">
          <button
            className="focus:outline-none mr-2"
            onClick={() => toggleSubtaskComplete(subtask.id, subtask.status || 'to_do')}
            aria-label={
              subtask.status?.toLowerCase() === 'done'
                ? 'Mark as incomplete'
                : 'Mark as complete'
            }
          >
            {subtask.status?.toLowerCase() === 'done' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>

          <div className="flex-grow flex justify-between items-center">
            <span
              className={`text-sm ${
                subtask.status?.toLowerCase() === 'done'
                  ? 'line-through text-gray-500'
                  : ''
              }`}
            >
              {subtask.title}
            </span>
            <div className="flex items-center space-x-2">
              <SubtaskDropdownMenu
                subtask={subtask}
                onEdit={() => {
                  setSelectedSubtask(subtask);
                  setIsEditDialogOpen(true);
                }}
                onDelete={() => {
                  setSelectedSubtask(subtask);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {selectedSubtask && isEditDialogOpen && (
        <EditTaskDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          task={selectedSubtask}
          onUpdateTask={handleEditSubtask}
        />
      )}

      {selectedSubtask && isDeleteDialogOpen && (
        <DeleteTaskDialog
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          taskId={selectedSubtask.id}
          taskTitle={selectedSubtask.title}
          onDeleteTask={handleDeleteSubtaskConfirm}
        />
      )}
    </div>
  );
}