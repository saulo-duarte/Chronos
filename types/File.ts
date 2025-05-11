export interface File {
   id: number;
   name: string;
   content?: Uint8Array;
   link?: string;
   folder_id: number;
   created_at: string;
   updated_at?: string;
   is_favorite: boolean;
   file_type: string;
 }