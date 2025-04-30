'use client';

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Home } from 'lucide-react';
import { Folder } from '@/types/Folder';

import FolderHeader from './_components/FolderHeader';
import FolderNavigation from './_components/FolderNavigation';
import FolderContent from './_components/FolderContent';
import FolderDialogs from './_components/FolderDialogs';
import { ErrorAlert } from './_components/Util';
import { useFolderSystem } from './_hooks/useFolderSystem';

export default function FolderSystem() {
  const {
    allFolders,
    currentFolders,
    currentFolderId,
    folderPath,
    isLoading,
    error,
    navigateToFolder,
    navigateUp,
    navigateToRoot,
    handleAddFolder,
    handleUpdateFolder,
    fetchAllFolders,
    getCurrentFolderName
  } = useFolderSystem();

  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openEditDialog = (folder: Folder) => {
    const folderWithPath = {
      ...folder,
      path: folder.path || `/${folder.name}`
    };
    setEditingFolder(folderWithPath);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (folder: Folder) => {
    setFolderToDelete(folder);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Card className="bg-background border-0 shadow-none">
        <FolderHeader 
          onClickNewFolder={() => setIsAddDialogOpen(true)} 
          onClickHome={navigateToRoot} 
          onClickBack={navigateUp}
          disableNavigation={folderPath.length <= 1}
        />
        
        <CardContent>
          <FolderNavigation 
            folderPath={folderPath} 
            onNavigate={(item, index) => {
              navigateToFolder(item);
            }} 
          />
          
          {error && <ErrorAlert message={error} />}
          
          <FolderContent 
            isLoading={isLoading}
            folders={currentFolders}
            folderName={getCurrentFolderName()}
            onNavigate={navigateToFolder}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
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
            onDeleteFolder={async () => console.log('Delete folder')}
          />
        </CardContent>
      </Card>
    </div>
  );
}