import { ImSpinner9 } from "react-icons/im";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUp, Link, File as FileIcon, X } from 'lucide-react';

interface AddFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFile: (
    name: string,
    content: Uint8Array | null,
    link: string | null,
    isFavorite: boolean
  ) => void;
  currentFolderId: number;
  currentFolderName: string;
}

export default function AddFileDialog({
  isOpen,
  onClose,
  onAddFile,
  currentFolderId,
  currentFolderName
}: AddFileDialogProps) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    resetForm();
    if (tab === 'upload') {
      setName('');
    }
  };

  const resetForm = () => {
    setName('');
    setLink('');
    setFile(null);
    setIsFavorite(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'link' && !name) return;

    setIsSubmitting(true);
    try {
      if (activeTab === 'upload') {
        if (file) {
          const buffer = await file.arrayBuffer();
          const content = new Uint8Array(buffer);
          await onAddFile(file.name, content, null, isFavorite);
        }
      } else {
        await onAddFile(name, null, link, isFavorite);
      }
      onClose();
    } catch (error) {
      console.error('Error adding file:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New File</DialogTitle>
          <DialogDescription>
            Add a file to folder: {currentFolderName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 mb-3">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileUp size={16} /> Upload File
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Link size={16} /> Add Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 pt-2">
              {!file ? (
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition mb-4"
                >
                  <FileUp className="w-6 h-6 mb-2 text-gray-500" />
                  <span className="text-sm text-gray-500">Click to upload a file</span>
                  <input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                  <div className="flex items-center gap-2">
                    <FileIcon size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-700 truncate max-w-[12rem]">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="link" className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="fileName">Name</Label>
                <Input
                  id="fileName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter file name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileLink">Link URL</Label>
                <Input
                  id="fileLink"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://"
                  type="url"
                  required
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFavorite"
              checked={isFavorite}
              onCheckedChange={(checked) => setIsFavorite(checked === true)}
            />
            <Label htmlFor="isFavorite">Add to favorites</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={(activeTab === 'upload' && !file) || isSubmitting}
            >
              {isSubmitting && (
                <ImSpinner9 className="animate-spin mr-2 inline-block" />
              )}
              {isSubmitting ? 'Adding...' : 'Add File'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
