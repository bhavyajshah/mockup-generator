export interface SupabaseFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
}

export interface UploadResponse {
  success: boolean;
  file?: SupabaseFile;
  error?: string;
}