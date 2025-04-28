import { Folder as FolderIcon, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
          className="border hover:border-blue-500 hover:shadow-md transition-all p-2 pr-0"
        >
          <CardContent className='pr-0'>
            <div className="flex flex-col h-full relative">
              <div 
                className="flex flex-col items-center justify-center py-4 cursor-pointer mb-2"
                onClick={() => onNavigate(folder)}
              >
                <FolderIcon size={64} className="text-blue-500 mb-2" />
                <h3 className="font-medium text-center break-all">{folder.name}</h3>
              </div>

              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8">
                      <MoreVertical size={36} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(folder)}>
                      <Edit size={16} className="mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(folder)} 
                      className="text-red-500 focus:text-red-700"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
