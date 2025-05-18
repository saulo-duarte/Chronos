"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Adicione isso se ainda não tiver

interface NewCategoryDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  categoryType: string;
  onAddCategory: (name: string, type: string, status: string, description: string) => Promise<void>;
}

export default function NewCategoryDialog({
  isOpen,
  setIsOpen,
  categoryType,
  onAddCategory
}: NewCategoryDialogProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const [description, setDescription] = useState(''); // novo

  useEffect(() => {
    if (isOpen) {
      setName('');
      setStatus('active');
      setDescription(''); // resetar
    }
  }, [isOpen]);

  const handleCreateCategory = async () => {
    if (!name.trim()) return;

    try {
      await onAddCategory(name, categoryType, status, description); // incluir description
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create New {categoryType === 'project' ? 'Project' : 'Study Topic'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Add a brief description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateCategory}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
