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

interface CreateDatabaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDatabaseCreated: () => void;
  baseDirectory: string | null;
}

export function CreateDatabaseDialog({ open, onOpenChange, onDatabaseCreated, baseDirectory }: CreateDatabaseDialogProps) {
  const [dbName, setDbName] = useState('');
  const [dbPath, setDbPath] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (open) {
      setDbName('');
      setDbPath(baseDirectory ? `${baseDirectory}` : '');
    }
  }, [open, baseDirectory]);

  const handleSelectPath = async () => {
    try {
      const selected = await openDialog({ directory: true, multiple: false });
      if (selected && !Array.isArray(selected)) {
        setDbPath(`${selected}/database.db`);
      }
    } catch (error) {
      console.error("Error selecting directory:", error);
      toast.error(`Error selecting directory: ${error}`);
    }
  };

  const handleCreateDatabase = async () => {
    if (!dbName.trim() || !dbPath.trim()) {
      toast.error('Database name and path are required');
      return;
    }
    try {
      setIsCreating(true);
      await invoke('add_database', { name: dbName, path: dbPath });
      toast.success(`Database '${dbName}' created`);
      onOpenChange(false);
      onDatabaseCreated();
    } catch (error) {
      console.error("Error creating database:", error);
      toast.error(`Error creating database: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Database</DialogTitle>
          <DialogDescription>Provide a name and file location for your new database.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="db-name" className="text-sm font-medium">Database Name</label>
            <Input id="db-name" placeholder="My Database" value={dbName} onChange={(e) => setDbName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label htmlFor="db-path" className="text-sm font-medium">File Location</label>
            <div className="flex space-x-2">
              <Input id="db-path" value={dbPath} onChange={(e) => setDbPath(e.target.value)} className="flex-1" />
              <Button type="button" variant="outline" onClick={handleSelectPath}>
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreateDatabase} disabled={isCreating}>{isCreating ? 'Creating...' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
