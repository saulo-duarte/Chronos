"use client"

import { useState, useEffect } from "react"
import type { File } from "@/types/File"
import { LinkIcon, FileText, ImageIcon, Music, Video, FileIcon as FileIconGeneric, AlertCircle } from "lucide-react"
import { FaYoutube } from "react-icons/fa"

export function useFilePreview(file: File) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    let url: string | null = null

    setIsLoading(true)
    setHasError(false)
    setErrorMessage("")

    const createBlobUrl = async () => {
      try {
        if (file?.content && Array.isArray(file.content) && file.content.length > 0) {
          const uint8Array = new Uint8Array(file.content)
          const blob = new Blob([uint8Array], { type: file.file_type || "application/octet-stream" })
          url = URL.createObjectURL(blob)
          setBlobUrl(url)
        } else {
          setBlobUrl(null)
        }
      } catch (error) {
        console.error("Error creating blob URL:", error)
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido ao processar o arquivo")
        setBlobUrl(null)
      } finally {
        setIsLoading(false)
      }
    }

    createBlobUrl()

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [file?.id, file?.content, file?.file_type])

  return {
    blobUrl,
    isLoading,
    hasError,
    errorMessage,
    fileType: file?.file_type,
    isLink: !!file?.link,
    fileName: file?.name,
    link: file?.link,
  }
}

export function FilePreview({ file }: { file: File }) {
  const { blobUrl, isLoading, hasError, errorMessage, fileType, isLink, fileName, link } = useFilePreview(file)

  const isYoutubeLink = isLink && link && (link.includes("youtube.com") || link.includes("youtu.be"))

  const getFileTypeIcon = () => {
    if (!fileType) return <FileIconGeneric className="text-gray-500" />

    if (fileType.startsWith("image/")) return <ImageIcon className="text-blue-500" />
    if (fileType.startsWith("audio/")) return <Music className="text-purple-500" />
    if (fileType.startsWith("video/")) return <Video className="text-pink-500" />
    if (fileType === "application/pdf") return <FileText className="text-red-500" />

    return <FileIconGeneric className="text-gray-500" />
  }

  const getFileTypeName = () => {
    if (!fileType) return "Arquivo"

    if (fileType.startsWith("image/")) return fileType.split("/")[1]?.toUpperCase() || "Imagem"
    if (fileType.startsWith("audio/")) return fileType.split("/")[1]?.toUpperCase() || "Áudio"
    if (fileType.startsWith("video/")) return fileType.split("/")[1]?.toUpperCase() || "Vídeo"
    if (fileType === "application/pdf") return "PDF"

    return fileType.split("/")[1] || "Arquivo"
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full max-w-xs rounded-lg bg-card transition-all duration-300">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <span className="text-sm mt-3 text-gray-600 dark:text-gray-300">Carregando arquivo...</span>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full max-w-xs rounded-lg bg-red-50 dark:bg-red-900/20 p-4 transition-all duration-300">
        <AlertCircle size={48} className="text-red-500 dark:text-red-400 mb-2" />
        <span className="text-sm font-medium text-red-700 dark:text-red-300">Erro ao carregar arquivo</span>
        {errorMessage && (
          <p className="text-xs mt-2 text-red-600 dark:text-red-400 text-center max-w-[90%]">{errorMessage}</p>
        )}
      </div>
    )
  }

  if (isLink) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full max-w-xs rounded-lg bg-card p-4 hover:bg-blue-950 transition-all duration-300">
        {isYoutubeLink ? (
          <>
            <FaYoutube size={64} className="text-red-600 mb-2" />
            <span className="text-sm mt-2 text-gray-700 dark:text-gray-300 font-medium">YouTube</span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs mt-1 text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[90%]"
            >
              {link}
            </a>
          </>
        ) : (
          <>
            <LinkIcon size={64} className="text-blue-500 mb-2" />
            <span className="text-sm mt-2 text-gray-700 dark:text-gray-300 font-medium">External Link</span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs mt-1 text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[90%]"
            >
              {link}
            </a>
          </>
        )}
      </div>
    )
  }

  if (fileType?.startsWith("image/")) {
    return (
      <div className="w-full max-w-xs h-64 flex items-center justify-center overflow-hidden bg-card rounded-lg relative group transition-all duration-300">
        {blobUrl ? (
          <>
            <img
              src={blobUrl || "/placeholder.svg"}
              alt={fileName || "Imagem"}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-full text-sm font-medium">
                {fileName || getFileTypeName()}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <ImageIcon size={64} className="text-gray-400" />
            <span className="text-sm mt-2 text-gray-500">Image not available</span>
          </div>
        )}
      </div>
    )
  }

  if (fileType === "application/pdf") {
    return (
      <div className="h-64 w-full max-w-xs flex items-center justify-center overflow-hidden bg-card rounded-lg hover:bg-card/80 transition-all duration-300">
        <div className="flex flex-col items-center justify-center">
          <FileText size={64} className="text-red-500 mb-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PDF</span>
          {fileName && (
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400 truncate max-w-[90%]">{fileName}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-64 w-full max-w-xs flex items-center justify-center overflow-hidden bg-card rounded-lg hover:bg-card/80 transition-all duration-300">
      <div className="flex flex-col items-center justify-center">
        {getFileTypeIcon()}
        <span className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-300">{getFileTypeName()}</span>
        {fileName && (
          <span className="text-xs mt-1 text-gray-500 dark:text-gray-400 truncate max-w-[90%]">{fileName}</span>
        )}
      </div>
    </div>
  )
}
