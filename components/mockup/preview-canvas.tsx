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
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const deviceFrameRef = useRef<HTMLDivElement>(null);

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

  const getDeviceStyles = () => {
    const baseStyles = {
      width: '80%',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative' as const,
      transform: `scale(${deviceConfig.scale})`,
    };

    switch (deviceConfig.type) {
      case 'desktop':
        return {
          ...baseStyles,
          aspectRatio: '16/10',
        };
      case 'mobile':
        return {
          ...baseStyles,
          width: '40%',
          aspectRatio: '9/19',
        };
      default:
        return baseStyles;
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

      <div
        className="relative aspect-video bg-accent/50 rounded-lg overflow-hidden backdrop-blur-sm"
        style={{ backgroundColor: mockupSettings.background.value }}
      >
        {imageUrl ? (
          <div
            ref={deviceFrameRef}
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
            style={getDeviceStyles()}
          >
            {/* Device Frame */}
            <div
              className="relative w-full h-full"
              style={{
                backgroundColor: deviceConfig.color,
                boxShadow: mockupSettings.effects.shadow
                  ? `0 ${mockupSettings.effects.depth}px ${mockupSettings.effects.depth * 2}px rgba(0,0,0,0.3)`
                  : 'none'
              }}
            >
              {/* Screen Content */}
              <div className="absolute inset-[8%] top-[5%] overflow-auto bg-white rounded-lg">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-auto"
                  style={{
                    minHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
                {mockupSettings.effects.reflection && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                    }}
                  />
                )}
              </div>

              {/* Device Frame Overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url('https://png.pngtree.com/png-clipart/20230222/ourmid/pngtree-macbook-pro-16-png-image_6614408.png')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </div>
          </div>
        ) : (
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