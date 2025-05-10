import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Folder } from '@/types/Folder';
import { File } from '@/types/File';
import { open as openURL } from '@tauri-apps/plugin-shell';

export function useFolderSystem() {
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [currentFolders, setCurrentFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllFolders();
  }, []);

  useEffect(() => {
    if (allFolders.length > 0) {
      updateCurrentFolders();
      
      if (currentFolderId !== null) {
        fetchFilesByFolderId(currentFolderId);
      }
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

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await invoke('delete_folder_command', { folderId });
      await fetchAllFolders();
      return Promise.resolve();
    } catch (err) {
      setError(`Error deleting folder: ${err}`);
      console.error('Error deleting folder:', err);
      return Promise.reject(err);
    }
  };

  const getCurrentFolderName = () => {
    if (folderPath.length === 0) return 'Root';
    return folderPath[folderPath.length - 1].name;
  };

  const fetchFilesByFolderId = async (folderId: number) => {
    try {
      setIsFilesLoading(true);
      const result = await invoke('get_files_by_folder_id_command', { folderIdParam: folderId }) as File[];
      setFiles(result);
    } catch (err) {
      setError(`Error loading files: ${err}`);
      console.error('Error loading files:', err);
    } finally {
      setIsFilesLoading(false);
    }
  };

  const handleUpdateFile = async (
    fileId: number,
    folderId: number,
    name: string,
    content: Uint8Array | null,
    link: string | null,
    fileType: string,
    isFavorite: boolean,
    createdTime: string,
  ) => {
    try {
      await invoke('update_file_command', { 
        fileId,
        folderId,
        fileType,
        name, 
        content: content ? Array.from(content) : null, 
        link, 
        isFavorite,
        createdTime,
      });
      await fetchFilesByFolderId(currentFolderId || 1);
      return Promise.resolve();
    } catch (err) {
      setError(`Error updating file: ${err}`);
      console.error('Error updating file:', err);
      return Promise.reject(err);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      await invoke('delete_file_command', { fileId });
      await fetchFilesByFolderId(currentFolderId || 1);
      return Promise.resolve();
    } catch (err) {
      setError(`Error deleting file: ${err}`);
      console.error('Error deleting file:', err);
      return Promise.reject(err);
    }
  };

  const handleToggleFavoriteFile = async (file: File) => {
    try {
      await invoke('update_file_command', { 
        fileId: file.id,
        folderId: file.folder_id,
        fileType: file.file_type,
        name: file.name, 
        content: file.content ? Array.from(file.content) : null, 
        link: file.link, 
        isFavorite: !file.is_favorite,
        createdTime: file.created_at, 
      });
      await fetchFilesByFolderId(currentFolderId || 1);
      return Promise.resolve();
    } catch (err) {
      setError(`Error toggling favorite file: ${err}`);
      console.error('Error toggling favorite file:', err);
      return Promise.reject(err);
    }
  };

  const handleOpenFile = async (file: File) => {
    const rawLink = file.link;
    const cleanLink = rawLink?.trim().replace(/^"+|"+$/g, '');
    if (cleanLink) {
      try {
        await openURL(cleanLink);
      } catch (err) {
        console.error("Failed to open external link via Tauri shell:", err);
      }
    } else {
      const blob = new Blob([file.content ? new Uint8Array(file.content) : new Uint8Array()], { type: file.file_type });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };
  

  const handleAddFile = async (name: string, content: Uint8Array | null, link: string | null, folderId: number, isFavorite: boolean) => {
    try {
      await invoke('add_file_command', { 
        name, 
        content: content ? Array.from(content) : null,
        link, 
        folderId, 
        isFavorite 
      });
      await fetchFilesByFolderId(folderId);
      return Promise.resolve();
    } catch (err) {
      setError(`Error adding file: ${err}`);
      console.error('Error adding file:', err);
      return Promise.reject(err);
    }
  };

  return {
    allFolders,
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
    fetchAllFolders,
    fetchFilesByFolderId,
    handleAddFile,
    getCurrentFolderName,
    handleUpdateFile,
    handleDeleteFile,
    handleToggleFavoriteFile,
    handleOpenFile,
    setCurrentFolderId,
    setCurrentFolders,
    setAllFolders,
    setFiles,
    setIsLoading,
    setIsFilesLoading,
    setError,
    setFolderPath,
  };
}