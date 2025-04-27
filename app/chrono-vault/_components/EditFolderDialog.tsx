import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Folder } from '@/types/Folder';

interface EditFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
  onUpdateFolder: (id: string | number, name: string, path: string) => void;
}

export default function EditFolderDialog({ isOpen, onClose, folder, onUpdateFolder }: EditFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const [folderPath, setFolderPath] = useState('');

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
      setFolderPath(folder.path || '');
    }
  }, [folder]);

  const handleSubmit = () => {
    if (!folder || !folderName || !folderPath) return;
    onUpdateFolder(folder.id, folderName, folderPath);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Folder Name</Label>
            <Input
              id="edit-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-path">Folder Path</Label>
            <Input
              id="edit-path"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}