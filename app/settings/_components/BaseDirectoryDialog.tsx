"use client";

import { useState, useEffect } from 'react';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FolderOpen } from 'lucide-react';

interface BaseDirectoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDirectorySet: () => void;
  currentDirectory: string | null;
}

export function BaseDirectoryDialog({ open, onOpenChange, onDirectorySet, currentDirectory }: BaseDirectoryDialogProps) {
  const [directory, setDirectory] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (open) {
      setDirectory(currentDirectory ?? '');
    }
  }, [open, currentDirectory]);

  const handleSelectDirectory = async () => {
    try {
      const selected = await openDialog({ directory: true, multiple: false });
      if (selected && !Array.isArray(selected)) {
        setDirectory(selected);
      }
    } catch (error) {
      toast.error(`Error selecting directory: ${error}`);
    }
  };

  const handleSetBaseDirectory = async () => {
    if (!directory.trim()) {
      toast.error('Directory path is required');
      return;
    }
    try {
      setIsUpdating(true);
      await invoke('set_last_directory', { path: directory });
      toast.success('Base directory set');
      onOpenChange(false);
      onDirectorySet();
    } catch (error) {
      console.error("Error setting base directory:", error);
      toast.error(`Error setting base directory: ${error}`);
    }
     finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Base Directory</DialogTitle>
          <DialogDescription>Choose a base directory for database discovery.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex space-x-2">
            <Input value={directory} onChange={(e) => setDirectory(e.target.value)} className="flex-1" />
            <Button type="button" variant="outline" onClick={handleSelectDirectory}>
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSetBaseDirectory} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
