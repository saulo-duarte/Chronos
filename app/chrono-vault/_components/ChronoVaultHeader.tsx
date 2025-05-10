import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Home } from 'lucide-react';

interface FolderHeaderProps {
  onClickNewFolder: () => void;
  onClickNewFile: () => void;
  onClickHome: () => void;
  onClickBack: () => void;
  disableNavigation: boolean;
}

export default function ChronoVaultHeader({
  onClickNewFolder,
  onClickNewFile,
  onClickHome,
  onClickBack,
  disableNavigation
}: FolderHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-2xl font-bold">
        <div className="flex items-center gap-2">
          Chrono Vault
        </div>
      </CardTitle>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="gap-1"
          onClick={onClickHome}
          disabled={disableNavigation}
        >
          <Home size={16} /> Root
        </Button>
        <Button 
          variant="outline" 
          className="gap-1"
          onClick={onClickBack}
          disabled={disableNavigation}
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button className="gap-1" onClick={onClickNewFolder}>
          <Plus size={16} /> New Folder
        </Button>
        <Button className="gap-1" onClick={onClickNewFile}>                                         
          <Plus size={16} /> New File
        </Button>
      </div>
    </CardHeader>
  );
}