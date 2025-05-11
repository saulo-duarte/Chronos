import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WorkspaceHeaderProps {
  openNewCategoryDialog: (type: string) => void;
}

export default function WorkspaceHeader({ openNewCategoryDialog }: WorkspaceHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">My Workspace</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => openNewCategoryDialog('project')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
        <Button 
          variant="outline" 
          onClick={() => openNewCategoryDialog('study')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Study
        </Button>
      </div>
    </div>
  );
}