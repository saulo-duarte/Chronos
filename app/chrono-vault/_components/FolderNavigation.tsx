import { Folder } from '@/types/Folder';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList,
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';

interface FolderNavigationProps {
  folderPath: Folder[];
  onNavigate: (item: Folder, index: number) => void;
}

export default function FolderNavigation({ folderPath, onNavigate }: FolderNavigationProps) {
  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {folderPath.map((item, index) => (
            <div key={item.id} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => onNavigate(item, index)}>
                  {item.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}