'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ImSpinner9 } from 'react-icons/im';

interface AddTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  categoryId?: number;
  parentId?: number;
  onSuccess?: () => void;
  onHandleAddTask?: (task: any) => void;
}

export default function AddTaskDialog({
  isOpen,
  setIsOpen,
  categoryId,
  parentId,
  onSuccess,
  onHandleAddTask
}: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setError(null);
    }
  }, [isOpen]);

  const handleCreateTask = async () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
  
    if (!categoryId) {
      setError('Category is required for project tasks');
      return;
    }
  
    try {
      setIsSubmitting(true);
      setError(null);
  
      const formattedDueDate = dueDate ? format(dueDate, 'yyyy-MM-dd') : null;
  
      if (onHandleAddTask) {
        await onHandleAddTask({
          title,
          description: description || null,
          categoryId,
          parentId,
          dueDate: formattedDueDate
        });
      }
  
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(`Failed to create task: ${err}`);
      console.error('Failed to create task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Task title"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Task description (optional)"
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="due-date"
                  variant="outline"
                  className="col-span-3 justify-start text-left font-normal"
                  disabled={isSubmitting}
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
          
          {parentId && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Parent Task</Label>
              <div className="col-span-3">
                <p className="text-sm text-gray-500">
                  This will be a subtask of task #{parentId}.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleCreateTask} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <ImSpinner9 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}