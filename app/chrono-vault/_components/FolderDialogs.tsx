import { Folder } from '@/types/Folder';
import AddFolderDialog from './AddFolderDialog';
import EditFolderDialog from './EditFolderDialog';
import DeleteFolderDialog from './DeleteFolderDialog';

interface FolderDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  editingFolder: Folder | null;
  folderToDelete: Folder | null;
  currentFolderName: string;
  currentFolderId: number;
  onCloseAddDialog: () => void;
  onCloseEditDialog: () => void;
  onCloseDeleteDialog: () => void;
  onAddFolder: (name: string, parentId: number) => Promise<void>;
  onUpdateFolder: (id: string | number, name: string, path: string) => Promise<void>;
  onDeleteFolder: () => Promise<void>;
}

export default function FolderDialogs({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  editingFolder,
  folderToDelete,
  currentFolderName,
  currentFolderId,
  onCloseAddDialog,
  onCloseEditDialog,
  onCloseDeleteDialog,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder
}: FolderDialogsProps) {
  return (
    <>
      <AddFolderDialog 
        isOpen={isAddDialogOpen}
        onClose={onCloseAddDialog}
        onAddFolder={onAddFolder}
        currentFolder={currentFolderName}
        currentFolderId={currentFolderId}
      />
      
      {editingFolder && (
        <EditFolderDialog 
          isOpen={isEditDialogOpen}
          onClose={onCloseEditDialog}
          folder={editingFolder}
          onUpdateFolder={onUpdateFolder}
        />
      )}
      
      {folderToDelete && (
        <DeleteFolderDialog 
          isOpen={isDeleteDialogOpen}
          onClose={onCloseDeleteDialog}
          folder={folderToDelete}
          onDeleteFolder={onDeleteFolder}
        />
      )}
    </>
  );
}