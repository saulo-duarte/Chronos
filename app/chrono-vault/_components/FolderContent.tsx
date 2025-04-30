import { Folder } from '@/types/Folder';
import FolderGrid from './FolderGrid';
import EmptyState from './Util';
import { LoadingState } from './Util';

interface FolderContentProps {
  isLoading: boolean;
  folders: Folder[];
  folderName: string;
  onNavigate: (folder: Folder) => void;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

export default function FolderContent({
  isLoading,
  folders,
  folderName,
  onNavigate,
  onEdit,
  onDelete
}: FolderContentProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (folders.length === 0) {
    return <EmptyState folderName={folderName} />;
  }

  return (
    <FolderGrid
      folders={folders}
      onNavigate={onNavigate}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}