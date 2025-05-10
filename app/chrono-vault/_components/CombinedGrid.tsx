"use client";

import { useState } from 'react';
import { Folder } from '@/types/Folder';
import { File } from '@/types/File';
import { 
  Folder as FolderIcon, 
  Star, 
  MoreVertical, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FilePreview } from '../_hooks/useFilePreview';

interface CombinedGridProps {
  folders: Folder[];
  files: File[];
  onNavigateFolder: (folder: Folder) => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onOpenFile?: (file: File) => void;
  onEditFile?: (file: File) => void;
  onDeleteFile?: (file: File) => void;
  onToggleFavoriteFile?: (file: File) => void;
  
}

export default function CombinedGrid({
  folders,
  files,
  onNavigateFolder,
  onEditFolder,
  onDeleteFolder,
  onOpenFile,
  onEditFile,
  onDeleteFile,
  onToggleFavoriteFile
}: CombinedGridProps) {
  type DropdownTarget = `folder-${string | number}` | `file-${string | number}` | null;

  const [openDropdownId, setOpenDropdownId] = useState<DropdownTarget>(null);

  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full text-center text-gray-500">
        <img
          src="/EmptyFolder.svg"
          alt="Empty Vault"
          className="w-96 h-96 mb-4"
        />
        <h2 className="text-xl font-semibold mb-2 text-blue-500">Your vault is empty</h2>
        <p className="text-md text-gray-400">Start by adding files or links to get organized.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {folders.map((folder) => (
      <Card
        key={`folder-${folder.id}`}
        className="relative w-full h-[220px] border bg-card overflow-hidden p-0"
        onClick={(e) => {
          if (
            e.currentTarget === e.target ||
            (e.target instanceof Element && !e.target.closest('button'))
          ) {
            onNavigateFolder(folder);
          }
        }}
      >
        <div className="flex items-center justify-between bg-gray-900 text-white px-3 py-1">
          <h3 className="text-sm font-medium truncate w-4/5">{folder.name}</h3>
          <DropdownMenu
            open={openDropdownId === `folder-${folder.id}`}
            onOpenChange={(isOpen) => {
              setOpenDropdownId(isOpen ? `folder-${folder.id}` : null);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[1000] min-w-[12rem]">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpenDropdownId(null);
                  onEditFolder(folder);
                }}
              >
                <Edit size={16} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpenDropdownId(null);
                  onDeleteFolder(folder);
                }}
                className="text-red-500 focus:text-red-700"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col justify-center items-center h-[calc(100%-48px)] px-4">
          <FolderIcon size={64} className="text-blue-500 mb-4" />
        </div>
      </Card>
    ))}

      {files.map((file) => (
        <Card
          key={`file-${file.id}`}
          className="relative w-full h-[220px] border bg-card overflow-hidden cursor-pointer mt-0 p-0"
          onClick={(e) => {
            if (e.currentTarget === e.target || (e.target instanceof Element && !e.target.closest('button'))) {
              onOpenFile && onOpenFile(file);
            }
          }}
        >
        <div className="flex items-center justify-between bg-gray-900 text-white px-3 py-1">
          <h3 className="text-sm font-medium truncate w-4/5">{file.name}</h3>
          <DropdownMenu
            open={openDropdownId === `file-${file.id}`}
            onOpenChange={(isOpen) => {
              setOpenDropdownId(isOpen ? `file-${file.id}` : null);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[1000] min-w-[12rem]">
              {onToggleFavoriteFile && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpenDropdownId(null);
                    onToggleFavoriteFile(file);
                  }}
                >
                  {file.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </DropdownMenuItem>
              )}
              {onEditFile && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpenDropdownId(null);
                    onEditFile(file);
                  }}
                >
                  Edit
                </DropdownMenuItem>
              )}
              {onDeleteFile && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpenDropdownId(null);
                    onDeleteFile(file);
                  }}
                  className="text-red-500 focus:text-red-700"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      
        <div className="flex flex-col justify-center items-center h-[calc(100%-48px)] px-4">
          <FilePreview file={file} />
          {file.updated_at && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(file.updated_at).toLocaleDateString()}
            </p>
          )}
          {file.is_favorite && (
            <Star size={16} className="text-yellow-500 fill-yellow-500 mt-1" />
          )}
        </div>
      </Card>
      
      ))}
    </div>
  );
}