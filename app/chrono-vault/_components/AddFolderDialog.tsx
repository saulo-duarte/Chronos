'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFolder: (name: string, parentId: number) => void;
  currentFolder: string;
  currentFolderId: number;
}

export default function AddFolderDialog({
  isOpen,
  onClose,
  onAddFolder,
  currentFolder,
  currentFolderId
}: AddFolderDialogProps) {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = () => {
    if (!folderName) return;

    onAddFolder(folderName, currentFolderId);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFolderName('');
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Folder Inside: {currentFolder}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter the folder name"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
