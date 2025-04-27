export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-300 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {message}
    </div>
  );
}

export default function EmptyState({ folderName }: { folderName: string }) {
  return (
    <div className="text-center p-12 border-2 border-dashed rounded-lg">
      <img src="/EmptyFolder.svg" alt="Empty Folder" className="mx-auto mb-4" width={450}/>
      <h3 className="text-lg font-medium mb-2">Empty Folder</h3>
      <p className="text-gray-500">
        The folder <span className="font-semibold">{folderName}</span> doesn't contain any subfolders.
      </p>
      <p className="text-gray-500 mt-2">
        Click on "New Folder" to create a subfolder.
      </p>
    </div>
  );
}
  
export function LoadingState() {
  return (
    <div className="text-center py-8">
      Loading folders...
    </div>
  );
}