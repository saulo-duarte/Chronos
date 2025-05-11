import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  taskId: number | null;
  taskTitle: string | null;
  onDeleteTask: (taskId: number) => void;
}

export default function DeleteTaskDialog({
  isOpen,
  setIsOpen,
  taskId,
  taskTitle,
  onDeleteTask
}: DeleteTaskDialogProps) {
  const handleDelete = () => {
    if (taskId !== null) {
      onDeleteTask(taskId);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete the task{' '}
            <span className="font-semibold">{taskTitle}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
