import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Folder } from '@/types/Folder';

export function useFolderSystem() {
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [currentFolders, setCurrentFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
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
      await fetchAllFolders();
      return Promise.resolve();
    } catch (err) {
      setError(`Error adding folder: ${err}`);
      console.error('Error adding folder:', err);
      return Promise.reject(err);
    }
  };

  const handleUpdateFolder = async (id: string | number, name: string, path: string) => {
    try {
      const folderId = typeof id === 'string' ? parseInt(id, 10) : id;
      await invoke('update_folder_command', { folderId, name });
      await fetchAllFolders();
      return Promise.resolve();
    } catch (err) {
      setError(`Error updating folder: ${err}`);
      console.error('Error updating folder:', err);
      return Promise.reject(err);
    }
  };

  const getCurrentFolderName = () => {
    if (folderPath.length === 0) return 'Root';
    return folderPath[folderPath.length - 1].name;
  };

  return {
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
  };
}