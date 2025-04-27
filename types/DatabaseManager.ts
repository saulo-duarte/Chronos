export interface DatabaseInfo {
    name: string;
    path: string;
    created_at: string;
    last_accessed: string | null;
    is_active: boolean;
  }