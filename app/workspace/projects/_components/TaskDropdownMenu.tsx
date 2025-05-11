'use client';

import { useTasks } from '@/hooks/useTaskSystem';
import { Task } from '@/types/Task';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  CheckCircle,
  Edit,
  Trash,
  PlusCircle,
  ArchiveIcon,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface TaskDropdownMenuProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubtask: () => void;
}

export default function TaskDropdownMenu({ 
  task, 
  onEdit, 
  onDelete, 
  onAddSubtask 
}: TaskDropdownMenuProps) {
  const { handleChangeTaskStatus } = useTasks(false);

  const getAvailableStatusTransitions = (task: Task) => {
    const currentStatus = task.status?.toLowerCase() || '';
    const isMainTask = !task.parent_id;

    if (isMainTask) {
      return getMainTaskTransitions(currentStatus);
    } else {
      return getSubtaskTransitions(currentStatus);
    }
  };

  const getMainTaskTransitions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'to_do':
        return ['in_progress'];
      case 'in_progress':
        return ['backlog', 'done'];
      case 'backlog':
        return ['to_do', 'in_progress'];
      case 'not_initialized':
        return ['to_do'];
      case 'done':
        return [];
      default:
        return ['to_do'];
    }
  };

  const getSubtaskTransitions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'to_do':
        return ['in_progress', 'backlog', 'done'];
      case 'in_progress':
        return ['to_do', 'backlog', 'done'];
      case 'backlog':
        return ['to_do', 'in_progress'];
      case 'done':
        return ['to_do', 'in_progress', 'backlog'];
      default:
        return ['to_do', 'in_progress', 'backlog', 'done'];
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {getAvailableStatusTransitions(task).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleChangeTaskStatus(task.id, status)}
          >
            {status === 'done' && <CheckCircle className="h-4 w-4 mr-2" />}
            {status === 'in_progress' && <Clock className="h-4 w-4 mr-2" />}
            {status === 'to_do' && <AlertCircle className="h-4 w-4 mr-2" />}
            {status === 'backlog' && <ArchiveIcon className="h-4 w-4 mr-2" />}
            Mark as {status.replace('_', ' ')}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {!task.parent_id && (
          <>
            <DropdownMenuItem
              onClick={() => {
                console.log('Add Subtask button clicked');
                onAddSubtask();
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Subtask
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}