import { supabase } from './config';
import { SupabaseFile, UploadResponse } from './types';

const STORAGE_BUCKET = 'mockups';

export const storage = {
  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);

      const fileData: SupabaseFile = {
        id: data.path,
        name: fileName,
        url: publicUrl,
        size: buffer.length,
        type: file.type,
        created_at: new Date().toISOString()
      };

      return { success: true, file: fileData };
    } catch (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      };
    }
  },

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([path]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file'
      };
    }
  },

  /**
   * List all files in a bucket
   */
  async listFiles(): Promise<SupabaseFile[]> {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list();

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      name: item.name,
      url: supabase.storage.from(STORAGE_BUCKET).getPublicUrl(item.name).data.publicUrl,
      size: item.metadata?.size || 0,
      type: item.metadata?.mimetype || 'application/octet-stream',
      created_at: item.created_at
    }));
  }
};