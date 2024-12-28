"use client";

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { validateImage } from '@/lib/utils/image-processor';

interface UploadZoneProps {
  onFilesAccepted: (files: File[]) => void;
}

export function UploadZone({ onFilesAccepted }: UploadZoneProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const validFiles = await Promise.all(
        acceptedFiles.slice(0, 10).map(async (file) => {
          await validateImage(file);
          return file;
        })
      );
      onFilesAccepted(validFiles);
    } catch (error) {
      console.error('File validation error:', error);
    }
  }, [onFilesAccepted]);

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