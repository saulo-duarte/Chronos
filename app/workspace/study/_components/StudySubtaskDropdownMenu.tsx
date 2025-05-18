'use client';

import { Task } from '@/types/Task';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudySubtaskDropdownMenuProps {
  subtask: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export default function StudySubtaskDropdownMenu({ 
  subtask, 
  onEdit, 
  onDelete 
}: StudySubtaskDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <span className="sr-only">Open study subtask menu</span>
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-3 w-3" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash className="mr-2 h-3 w-3" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}