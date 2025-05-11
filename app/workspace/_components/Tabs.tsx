import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category } from '@/types/Category';
import CategoryCard from './CategoryCard';

interface WorkspaceTabsProps {
  projects: Category[];
  studies: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: number) => void;
  onSelectCategory: (category: Category) => void;
}

export default function WorkspaceTabs({
  projects,
  studies,
  onEditCategory,
  onDeleteCategory,
  onSelectCategory
}: WorkspaceTabsProps) {
  const allCategories = [...projects, ...studies];

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="studies">Studies</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <CategoryGrid 
          categories={allCategories}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
          onSelectCategory={onSelectCategory}
          emptyMessage="No projects or studies yet. Create your first one!"
        />
      </TabsContent>
      
      <TabsContent value="projects">
        <CategoryGrid 
          categories={projects}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
          onSelectCategory={onSelectCategory}
          emptyMessage="No projects yet. Create your first project!"
        />
      </TabsContent>
      
      <TabsContent value="studies">
        <CategoryGrid 
          categories={studies}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
          onSelectCategory={onSelectCategory}
          emptyMessage="No studies yet. Create your first study topic!"
        />
      </TabsContent>
    </Tabs>
  );
}

interface CategoryGridProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: number) => void;
  onSelectCategory: (category: Category) => void;
  emptyMessage: string;
}

function CategoryGrid({
  categories,
  onEditCategory,
  onDeleteCategory,
  onSelectCategory,
  emptyMessage
}: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <p className="text-gray-500 col-span-full text-center py-8">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEditCategory}
          onDelete={onDeleteCategory}
          onSelect={onSelectCategory}
        />
      ))}
    </div>
  );
}