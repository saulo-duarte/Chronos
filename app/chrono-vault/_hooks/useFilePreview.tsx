import React, { useState, useEffect } from 'react';
import { File } from '@/types/File';
import { FileIcon, Link, FileText } from 'lucide-react';
import { PdfThumbnail } from '../_components/PDFThumbnail';

export function useFilePreview(file: File) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    
    setIsLoading(true);
    setHasError(false);

    const createBlobUrl = async () => {
      try {
        if (file?.content && Array.isArray(file.content) && file.content.length > 0) {
          const uint8Array = new Uint8Array(file.content);
          const blob = new Blob([uint8Array], { type: file.file_type || 'application/octet-stream' });
          url = URL.createObjectURL(blob);
          setBlobUrl(url);
        } else {
          setBlobUrl(null);
        }
      } catch (error) {
        console.error("Error creating blob URL:", error);
        setHasError(true);
        setBlobUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    createBlobUrl();

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file?.id, file?.content, file?.file_type]);

  return {
    blobUrl,
    isLoading,
    hasError,
    fileType: file?.file_type,
    isLink: !!file?.link,
    fileName: file?.name
  };
}

export function FilePreview({ file }: { file: File }) {
  const { 
    blobUrl, 
    isLoading, 
    hasError, 
    fileType, 
    isLink, 
    fileName 
  } = useFilePreview(file);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="text-xs mt-2 text-gray-500">Carregando...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-64">
        <FileIcon size={64} className="text-red-400" />
        <span className="text-xs mt-1 text-gray-500">Erro ao carregar arquivo</span>
      </div>
    );
  }

  if (isLink) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Link size={64} className="text-blue-500" />
        <span className="text-xs mt-1 text-gray-500">Link externo</span>
      </div>
    );
  }

  if (fileType?.startsWith('image/')) {
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden bg-card relative">
        {blobUrl ? (
          <img
            src={blobUrl}
            alt={fileName}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <FileIcon size={64} className="text-gray-400" />
        )}
      </div>
    );
  }

  
if (fileType === 'application/pdf') {
  return (
    <div className="h-64 w-64 flex items-center justify-center overflow-hidden bg-gray-100 rounded">
      {blobUrl ? (
        <PdfThumbnail blobUrl={blobUrl} fileName={fileName || 'PDF'} />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <FileText size={64} className="text-red-500" />
          <span className="text-sm mt-2">PDF</span>
        </div>
      )}
    </div>
  );
}

  return (
    <div className="flex flex-col items-center justify-center">
      <FileIcon size={64} className="text-gray-500" />
      <span className="text-xs mt-1 text-gray-500">{fileType?.split('/')[1] || 'Arquivo'}</span>
    </div>
  );
}