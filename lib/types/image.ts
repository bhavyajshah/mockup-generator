export interface ResizeOptions {
  width: number;
  height: number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  background?: {
    r: number;
    g: number;
    b: number;
    alpha: number;
  };
}

export interface OptimizeOptions {
  format: 'jpeg' | 'png' | 'webp';
  quality?: number;
  resize?: ResizeOptions;
  blur?: number;
  sharpen?: boolean;
}

export interface OptimizeResponse {
  success: boolean;
  imageData?: string;
  error?: string;
  metadata?: {
    format: string;
    width: number;
    height: number;
    size: number;
  };
}