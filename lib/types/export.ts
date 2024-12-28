export interface ExportOptions {
  mockupUrl: string;
  format: 'PNG' | 'JPEG';
  quality: number;
  width?: number;
  height?: number;
  fullPage?: boolean;
  customCSS?: string;
}

export interface ExportResult {
  url: string;
  format: string;
  size: number;
}