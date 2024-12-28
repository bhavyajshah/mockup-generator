"use client";

import { useEffect, useRef, useState } from 'react';
import { DeviceConfig, MockupSettings } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Maximize2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreviewCanvasProps {
  imageUrl: string | null;
  deviceConfig: DeviceConfig;
  mockupSettings: MockupSettings;
}

export function PreviewCanvas({ imageUrl, deviceConfig, mockupSettings }: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;
    // Canvas rendering logic here
  }, [imageUrl, deviceConfig, mockupSettings]);

  const handleExport = async () => {
    if (!imageUrl) return;

    try {
      setIsExporting(true);
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockupUrl: imageUrl,
          format: mockupSettings.export.format,
          quality: mockupSettings.export.quality,
          width: mockupSettings.export.resolution.width,
          height: mockupSettings.export.resolution.height,
          fullPage: false,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Export failed');
      }

      // Create download link
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `mockup.${mockupSettings.export.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: "Your mockup has been exported successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: error instanceof Error ? error.message : 'Failed to export mockup',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6 col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
          <Button size="sm" onClick={handleExport} disabled={!imageUrl || isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative aspect-video bg-accent/50 rounded-lg overflow-hidden backdrop-blur-sm">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">No preview available</p>
              <p className="text-sm text-muted-foreground">
                Upload an image or enter a URL to see your mockup
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}