'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
} from '@/components/ui/card';
import { Folder } from '@/types/Folder';
import ChronoVaultHeader from './_components/ChronoVaultHeader';
import FolderNavigation from './_components/FolderNavigation';
import FolderContent from './_components/FolderContent';
import FolderDialogs from './_components/FolderDialogs';
import AddFileDialog from './_components/AddFileDialog';
import ErrorAlert from './_components/Util';
import { useFolderSystem } from './_hooks/useFolderSystem';
import { File } from '@/types/File';
import EditFileDialog from './_components/EditFileDialog';

export default function FolderSystem() {
  const {
    currentFolders,
    currentFolderId,
    folderPath,
    files,
    isLoading,
    isFilesLoading,
    error,
    navigateToFolder,
    navigateUp,
    navigateToRoot,
    handleAddFolder,
    handleUpdateFolder,
    handleDeleteFolder,
    handleAddFile,
    handleUpdateFile,
    handleDeleteFile,
    handleToggleFavoriteFile,
    handleOpenFile,
    getCurrentFolderName
  } = useFolderSystem();

  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);
  const [isEditFileDialogOpen, setIsEditFileDialogOpen] = useState(false);

  const openEditDialog = (folder: Folder) => {
    const folderWithPath = {
      ...folder,
      path: folder.path || `/${folder.name}`
    };
    setEditingFolder(folderWithPath);
    setIsEditDialogOpen(true);
  };

  const openEditFileDialog = (file: File) => {
    setEditingFile(file);
    setIsEditFileDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Card className="bg-background border-0 shadow-none">
        <ChronoVaultHeader 
          onClickNewFolder={() => setIsAddDialogOpen(true)} 
          onClickHome={navigateToRoot} 
          onClickBack={navigateUp}
          onClickNewFile={() => setIsAddFileDialogOpen(true)}
          disableNavigation={folderPath.length <= 1}
        />
        
        <CardContent>
          <FolderNavigation 
            folderPath={folderPath} 
            onNavigate={(item, index) => {
              navigateToFolder(item);
            }} 
          />
          
          {error && <ErrorAlert folderName={error} />}
          
          <FolderContent 
            isLoading={isLoading}
            isFilesLoading={isFilesLoading}
            folders={currentFolders}
            folderName={getCurrentFolderName()}
            files={files}
            onNavigate={navigateToFolder}
            onEdit={openEditDialog}
            onDelete={(folder) => {
              setFolderToDelete(folder);
              setIsDeleteDialogOpen(true);
            }}
            onOpenFile={handleOpenFile}
            onEditFile={openEditFileDialog}
            onDeleteFile={(file) => handleDeleteFile(file.id)}
            onToggleFavoriteFile={handleToggleFavoriteFile}
          />
          
          <FolderDialogs 
            isAddDialogOpen={isAddDialogOpen}
            isEditDialogOpen={isEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            editingFolder={editingFolder}
            folderToDelete={folderToDelete}
            currentFolderName={getCurrentFolderName()}
            currentFolderId={currentFolderId || 0}
            onCloseAddDialog={() => setIsAddDialogOpen(false)}
            onCloseEditDialog={() => {
              setIsEditDialogOpen(false);
              setEditingFolder(null);
            }}
            onCloseDeleteDialog={() => {
              setIsDeleteDialogOpen(false);
              setFolderToDelete(null);
            }}
            onAddFolder={handleAddFolder}
            onUpdateFolder={handleUpdateFolder}
            onDeleteFolder={async () => {
              if (folderToDelete) {
                await handleDeleteFolder(folderToDelete.id);
                setIsDeleteDialogOpen(false);
                setFolderToDelete(null);
              }
            }}
          />
          
          <AddFileDialog
            isOpen={isAddFileDialogOpen}
            onClose={() => setIsAddFileDialogOpen(false)}
            onAddFile={(name, content, link, isFavorite) => 
              handleAddFile(name, content, link, currentFolderId || 1, isFavorite)
            }
            currentFolderId={currentFolderId || 0}
            currentFolderName={getCurrentFolderName()}
          />
          <EditFileDialog
            isOpen={isEditFileDialogOpen}
            onClose={() => {
              setIsEditFileDialogOpen(false);
              setEditingFile(null);
            }}
            onEditFile={(
              fileId,
              folderId,
              name,
              content,
              link,
              isFavorite,
              fileType,
              created_at
            ) =>
              handleUpdateFile(
                fileId,
                folderId,
                name,
                content,
                link,
                fileType,
                isFavorite,
                created_at,
              )
            }
            file={editingFile}
          />

        </CardContent>
      </Card>
    </div>
  );
}