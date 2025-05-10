import { Folder } from '@/types/Folder';
import { File } from '@/types/File';
import CombinedGrid from './CombinedGrid';
import { Skeleton } from '@/components/ui/skeleton';

interface FolderContentProps {
  isLoading: boolean;
  isFilesLoading: boolean;
  folders: Folder[];
  folderName: string;
  files: File[];
  onNavigate: (folder: Folder) => void;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  onOpenFile?: (file: File) => void;
  onEditFile?: (file: File) => void;
  onDeleteFile?: (file: File) => void;
  onToggleFavoriteFile?: (file: File) => void;
}

export default function FolderContent({
  isLoading,
  isFilesLoading,
  folders,
  folderName,
  files,
  onNavigate,
  onEdit,
  onDelete,
  onOpenFile,
  onEditFile,
  onDeleteFile,
  onToggleFavoriteFile
}: FolderContentProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">{folderName}</h2>
      <CombinedGrid
        folders={folders}
        files={files}
        onNavigateFolder={onNavigate}
        onEditFolder={onEdit}
        onDeleteFolder={onDelete}
        onOpenFile={onOpenFile}
        onEditFile={onEditFile}
        onDeleteFile={onDeleteFile}
        onToggleFavoriteFile={onToggleFavoriteFile}
      />
    </div>
  );
}