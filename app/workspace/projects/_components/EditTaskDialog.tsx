'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface EditTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task: Task;
  onUpdateTask: (
    taskId: number,
    title: string,
    description: string | null,
    categoryId: number | null,
    parentId: number | null,
    dueDate: string | null
  ) => Promise<void>;
  onTaskUpdated?: (updatedTask: Task) => void; // New callback to handle updated task
}

export default function EditTaskDialog({
  isOpen,
  setIsOpen,
  task,
  onUpdateTask,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.due_date ? new Date(task.due_date) : undefined);
    }
  }, [isOpen, task]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onUpdateTask(
        task.id,
        title,
        description || null,
        task.category_id,
        task.parent_id ?? null,
        dueDate ? dueDate.toISOString() : null
      );
      
      // Create an updated task object to pass to the callback
      const updatedTask: Task = {
        ...task,
        title,
        description: description || null,
        due_date: dueDate ? dueDate.toISOString() : null,
      };
      
      // Call the callback with the updated task if provided
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dueDate"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}