"use client"

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Category } from '@/types/Category';

export function useWorkspace() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Category[]>([]);
  const [studies, setStudies] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (allCategories.length > 0) {
      setProjects(allCategories.filter(category => category.type === 'project'));
      setStudies(allCategories.filter(category => category.type === 'study'));
    }
  }, [allCategories]);

  const fetchAllCategories = async () => {
    try {
      setIsLoading(true);
      const result = await invoke('get_all_categories_command') as Category[];
      setAllCategories(result);
      setError(null);
    } catch (err) {
      setError(`Error loading categories: ${err}`);
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryById = async (categoryId: number) => {
    try {
      setIsLoading(true);
      const result = await invoke('get_category_by_id_command', { categoryId }) as Category;
      setSelectedCategory(result);
      setError(null);
      return result;
    } catch (err) {
      setError(`Error loading category: ${err}`);
      console.error('Error loading category:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (
    name: string, 
    categoryType: string, 
    status: string,
    description: string
  ) => {
    try {
      await invoke('add_category_command', { 
        name, 
        categoryType, 
        status,
        description,
      });
      await fetchAllCategories();
      return Promise.resolve();
    } catch (err) {
      setError(`Error adding category: ${err}`);
      console.error('Error adding category:', err);
      return Promise.reject(err);
    }
  };

  const handleUpdateCategory = async (
    categoryId: number,
    name: string,
    categoryType: string,
    status: string
  ) => {
    try {
      await invoke('update_category_command', { 
        categoryId,
        name, 
        categoryType, 
        status 
      });
      await fetchAllCategories();
      return Promise.resolve();
    } catch (err) {
      setError(`Error updating category: ${err}`);
      console.error('Error updating category:', err);
      return Promise.reject(err);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await invoke('delete_category_command', { categoryId });
      await fetchAllCategories();
      if (selectedCategory && selectedCategory.id === categoryId) {
        setSelectedCategory(null);
      }
      return Promise.resolve();
    } catch (err) {
      setError(`Error deleting category: ${err}`);
      console.error('Error deleting category:', err);
      return Promise.reject(err);
    }
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const clearSelectedCategory = () => {
    setSelectedCategory(null);
  };

  return {
    allCategories,
    projects,
    studies,
    selectedCategory,
    isLoading,
    error,
    fetchAllCategories,
    fetchCategoryById,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    selectCategory,
    clearSelectedCategory,
  };
}