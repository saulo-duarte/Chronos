"use client";

import { BiSolidBookBookmark } from "react-icons/bi";
import { VscVscode } from "react-icons/vsc";
import { MoreVertical } from 'lucide-react';
import { Category } from '@/types/Category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
  onSelect: (category: Category) => void;
}

export default function CategoryCard({ 
  category, 
  onEdit, 
  onDelete, 
}: CategoryCardProps) {
  const isProject = category.type === 'project';
  const statusColor = getStatusColor(category.status);
  const router = useRouter();

  const handleCategoryClick = () => {
    const categoryType = category.type === 'project' ? 'projects' : 'study';
    router.push(`/workspace/${categoryType}?categoryId=${category.id}`);
  };

  return (
    <Card className="w-full transition-all hover:shadow-md py-2">
      <CardHeader className="flex flex-row items-start justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(category)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(category.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent 
        className="pt-0 cursor-pointer" 
        onClick={handleCategoryClick}
      >
        <div className="min-h-24 flex items-center justify-center">
          {isProject ? (
            <VscVscode className="text-blue-500" size={80} />
          ) : (
            <BiSolidBookBookmark className="text-yellow-500" size={80} />
          )}
        </div>
      </CardContent>
      <CardFooter 
        className="px-4 pt-0 pb-4 flex flex-col items-start w-full gap-1" 
        style={{ borderTop: '2px solid #212121' }}
      >          
        <h3 className="font-medium mt-1">{category.name}</h3>
        <p className={`text-xs mt-0 ${statusColor}`}>
          Status: {category.status}
        </p>
      </CardFooter>
    </Card>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'text-green-600';
    case 'pending':
    case 'on_hold':
      return 'text-yellow-600';
    case 'completed':
      return 'text-blue-600';
    case 'archived':
      return 'text-gray-600';
    default:
      return 'text-red-600';
  }
}