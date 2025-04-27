'use client';

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import FolderGrid from './_components/FolderGrid';
import { Button } from '@/components/ui/button';
import { Folder as FolderIcon, Plus, ArrowLeft, Home } from 'lucide-react';
import AddFolderDialog from './_components/AddFolderDialog';
import EditFolderDialog from './_components/EditFolderDialog';
import DeleteFolderDialog from './_components/DeleteFolderDialog';
import { ErrorAlert } from './_components/Util';
import EmptyState from './_components/Util';
import { LoadingState } from './_components/Util';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList,
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Folder } from '@/types/Folder';

export default function FolderSystem() {
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [currentFolders, setCurrentFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllFolders();
  }, []);

  useEffect(() => {
    if (allFolders.length > 0) {
      updateCurrentFolders();
    }
  }, [currentFolderId, allFolders]);

  const fetchAllFolders = async () => {
    try {
      setIsLoading(true);
      const result = await invoke('get_all_folders_command') as Folder[];
      setAllFolders(result);

      const rootFolder = result.find((folder: Folder) => folder.parent_id === null);
      if (rootFolder) {
        setCurrentFolderId(rootFolder.id);
        setFolderPath([{ id: rootFolder.id, name: rootFolder.name, parent_id: rootFolder.parent_id }]);
      }

      setError(null);
    } catch (err) {
      setError(`Error loading folders: ${err}`);
      console.error('Error loading folders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentFolders = () => {
    const folders = allFolders.filter((folder) => folder.parent_id === currentFolderId);
    setCurrentFolders(folders);
  };

  const navigateToFolder = (folder: Folder) => {
    setCurrentFolderId(folder.id);

    const existingIndex = folderPath.findIndex((item) => item.id === folder.id);
    if (existingIndex >= 0) {
      setFolderPath(folderPath.slice(0, existingIndex + 1));
    } else {
      setFolderPath([...folderPath, { id: folder.id, name: folder.name, parent_id: folder.parent_id }]);
    }
  };

  const navigateUp = () => {
    if (folderPath.length <= 1) return;

    const newPath = folderPath.slice(0, -1);
    setFolderPath(newPath);
    setCurrentFolderId(newPath[newPath.length - 1].id);
  };

  const navigateToRoot = () => {
    if (folderPath.length <= 1) return;

    const rootItem = folderPath[0];
    setFolderPath([rootItem]);
    setCurrentFolderId(rootItem.id);
  };

  const handleAddFolder = async (name: string, parentId: number) => {
    try {
      await invoke('add_folder_command', { name, parentId });
      setIsAddDialogOpen(false);
      await fetchAllFolders();
    } catch (err) {
      setError(`Error adding folder: ${err}`);
      console.error('Error adding folder:', err);
    }
  };

  // Updated to match EditFolderDialog expectations
  const handleUpdateFolder = async (id: string | number, name: string, path: string) => {
    try {
      // Convert string id to number if needed
      const folderId = typeof id === 'string' ? parseInt(id, 10) : id;
      await invoke('update_folder_command', { folderId, name });
      setIsEditDialogOpen(false);
      setEditingFolder(null);
      await fetchAllFolders();
    } catch (err) {
      setError(`Error updating folder: ${err}`);
      console.error('Error updating folder:', err);
    }
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;

    try {
      await invoke('delete_folder_command', { folderId: folderToDelete.id });
      setIsDeleteDialogOpen(false);
      setFolderToDelete(null);
      await fetchAllFolders();
    } catch (err) {
      setError(`Error deleting folder: ${err}`);
      console.error('Error deleting folder:', err);
    }
  };

  const openEditDialog = (folder: Folder) => {
    // Make sure the folder object has a path property before passing to EditFolderDialog
    const folderWithPath = {
      ...folder,
      // If path doesn't exist, create a default path based on folder name
      path: folder.path || `/${folder.name}`
    };
    setEditingFolder(folderWithPath);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (folder: Folder) => {
    setFolderToDelete(folder);
    setIsDeleteDialogOpen(true);
  };

  const getCurrentFolderName = () => {
    if (folderPath.length === 0) return 'Root';
    return folderPath[folderPath.length - 1].name;
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">
            <div className="flex items-center gap-2">
              <FolderIcon className="text-blue-500" />
              File System
            </div>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-1"
              onClick={navigateToRoot}
              disabled={folderPath.length <= 1}
            >
              <Home size={16} /> Home
            </Button>
            <Button 
              variant="outline" 
              className="gap-1"
              onClick={navigateUp}
              disabled={folderPath.length <= 1}
            >
              <ArrowLeft size={16} /> Back
            </Button>
            <Button className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
              <Plus size={16} /> New Folder
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Breadcrumb for navigation */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                {folderPath.map((item, index) => (
                  <div key={item.id} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      <BreadcrumbLink 
                        onClick={() => {
                          setCurrentFolderId(item.id);
                          setFolderPath(folderPath.slice(0, index + 1));
                        }}
                      >
                        {item.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {error && <ErrorAlert message={error} />}
          
          {isLoading ? (
            <LoadingState />
          ) : currentFolders.length === 0 ? (
            <EmptyState folderName={getCurrentFolderName()} />
          ) : (
            <FolderGrid 
              folders={currentFolders} 
              onNavigate={navigateToFolder}
              onEdit={openEditDialog} 
              onDelete={openDeleteDialog} 
            />
          )}
          
          <AddFolderDialog 
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onAddFolder={handleAddFolder}
            currentFolder={getCurrentFolderName()}
            currentFolderId={currentFolderId || 0}
          />
          
          {editingFolder && (
            <EditFolderDialog 
              isOpen={isEditDialogOpen}
              onClose={() => {
                setIsEditDialogOpen(false);
                setEditingFolder(null);
              }}
              folder={editingFolder}
              onUpdateFolder={handleUpdateFolder}
            />
          )}
          
          {folderToDelete && (
            <DeleteFolderDialog 
              isOpen={isDeleteDialogOpen}
              onClose={() => {
                setIsDeleteDialogOpen(false);
                setFolderToDelete(null);
              }}
              folder={folderToDelete}
              onDeleteFolder={handleDeleteFolder}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}