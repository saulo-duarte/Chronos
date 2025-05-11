export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  category_id: number | null;
  parent_id?: number | null;
  due_date?: string | null;
  type: 'project' | 'study' | 'event';
  last_recall?: string | null;
  recalls?: string | null;
  created_at: string;
  updated_at?: string | null;
}