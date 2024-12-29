"use client";

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { validateImage } from '@/lib/utils/image-processor';
import { useToast } from '@/hooks/use-toast';

interface UploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
}

export function UploadZone({ onFilesAccepted }: UploadZoneProps) {
  const { toast } = useToast();

  const uploadToSupabase = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const validFiles = await Promise.all(
        acceptedFiles.slice(0, 10).map(async (file) => {
          await validateImage(file);
          return file;
        })
      );

      // Upload first file to Supabase
      const url = await uploadToSupabase(validFiles[0]);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded successfully.",
      });

      onFilesAccepted([validFiles[0]]);
    } catch (error) {
      console.error('File validation/upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Failed to upload file',
      });
    }
  }, [onFilesAccepted, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-8 border-2 border-dashed cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-center">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">
            Drop your images here or click to upload
          </p>
          <p className="text-sm text-muted-foreground">
            Support for PNG, JPG, SVG (max 10MB)
          </p>
        </div>
      </div>
    </Card>
  );
}