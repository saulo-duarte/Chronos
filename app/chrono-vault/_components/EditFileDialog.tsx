import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { File } from '@/types/File';

interface EditFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditFile: (
    fileId: number,
    folderId: number,
    name: string, 
    content: Uint8Array | null, 
    link: string | null, 
    isFavorite: boolean, 
    fileType: string,
    created_at: string,
  ) => Promise<void>;
  file: File | null;
}

export default function EditFileDialog({ isOpen, onClose, onEditFile, file }: EditFileDialogProps) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const fileType = file?.file_type || 'text/plain';
  const fileId = file?.id;
  const folderId = file?.folder_id;
  const createdTime = file?.created_at || new Date().toISOString();

  useEffect(() => {
    if (file) {
      setName(String(file?.name || ''));
      setLink(file.link || '');
      setIsFavorite(file.is_favorite || false);
    }
  }, [file]);

  const handleSubmit = async () => {
    try {
      if (!fileId || !folderId) return;
      await onEditFile(fileId, folderId, name, null, link || null, isFavorite, fileType, createdTime);
      onClose();
    } catch (err) {
      console.error('Error editing file:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>

          {fileType === 'application/octet-stream' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="link" className="text-right">Link</label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="favorite" className="text-right">Favorite</label>
            <Input
              id="favorite"
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}