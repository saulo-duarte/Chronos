import { Folder as FolderIcon, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Folder } from '@/types/Folder';

interface FolderGridProps {
  folders: Folder[];
  onNavigate: (folder: Folder) => void;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

export default function FolderGrid({ folders, onNavigate, onEdit, onDelete }: FolderGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {folders.map((folder) => (
        <Card 
          key={folder.id} 
          className="border hover:border-blue-500 hover:shadow-md transition-all"
        >
          <CardContent className="p-4">
            <div className="flex flex-col h-full">
              <div 
                className="flex flex-col items-center justify-center py-4 cursor-pointer mb-2"
                onClick={() => onNavigate(folder)}
              >
                <FolderIcon size={48} className="text-blue-500 mb-2" />
                <h3 className="font-medium text-center break-all">{folder.name}</h3>
              </div>
              
              <div className="flex justify-center mt-auto gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onEdit(folder)} 
                  title="Edit"
                >
                  <Edit size={16} className="mr-1" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 text-red-500 hover:text-red-700"
                  onClick={() => onDelete(folder)} 
                  title="Delete"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}