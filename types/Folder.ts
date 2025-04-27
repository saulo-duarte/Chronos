export interface Folder {
    id: number;
    name: string;
    parent_id: number | null;
    path?: string;
  }