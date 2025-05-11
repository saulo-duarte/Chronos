"use client"

import { useWorkspace } from './_hooks/useWorkspace';
import { Loader2 } from 'lucide-react';
import WorkspaceHeader from './_components/Header';
import WorkspaceTabs from './_components/Tabs';
import { useState } from 'react';
import NewCategoryDialog from './_components/AddCategoryDialog';
import EditCategoryDialog from './_components/EditCategoryDialog';
import { Category } from '@/types/Category';

export default function WorkspacePage() {
  const { 
    projects, 
    studies, 
    isLoading, 
    error, 
    handleAddCategory, 
    handleUpdateCategory,
    handleDeleteCategory, 
    selectCategory,
  } = useWorkspace();

  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [newCategoryType, setNewCategoryType] = useState('project');
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);

  const openNewCategoryDialog = (type: string) => {
    setNewCategoryType(type);
    setIsNewCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: Category) => {
    setSelectedCategoryForEdit(category);
    setIsEditCategoryDialogOpen(true);
  };

  const handleDeleteCategorySubmit = async (categoryId: number) => {
    try {
      await handleDeleteCategory(categoryId);
      if (selectedCategoryForEdit?.id === categoryId) {
        setIsEditCategoryDialogOpen(false);
        setSelectedCategoryForEdit(null);
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <WorkspaceHeader openNewCategoryDialog={openNewCategoryDialog} />
      
      <WorkspaceTabs 
        projects={projects}
        studies={studies}
        onEditCategory={openEditCategoryDialog}
        onDeleteCategory={handleDeleteCategorySubmit}
        onSelectCategory={selectCategory}
      />

      <NewCategoryDialog
        isOpen={isNewCategoryDialogOpen}
        setIsOpen={setIsNewCategoryDialogOpen}
        categoryType={newCategoryType}
        onAddCategory={handleAddCategory}
      />

      {selectedCategoryForEdit && (
        <EditCategoryDialog
          isOpen={isEditCategoryDialogOpen}
          setIsOpen={setIsEditCategoryDialogOpen}
          category={selectedCategoryForEdit}
          onUpdateCategory={handleUpdateCategory}
        />
      )}
    </div>
  );
}