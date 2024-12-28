"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { UploadZone } from '@/components/mockup/upload-zone';
import { UrlInput } from '@/components/mockup/url-input';
import { DeviceSelector } from '@/components/mockup/device-selector';
import { DeviceConfigPanel } from '@/components/mockup/device-config-panel';
import { MockupSettingsPanel } from '@/components/mockup/mockup-settings-panel';
import { PreviewCanvas } from '@/components/mockup/preview-canvas';
import { DeviceConfig, MockupSettings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfig>({
    type: 'desktop',
    model: 'macbook-pro',
    orientation: 'landscape',
    color: '#000000',
    scale: 1,
    position: { x: 0, y: 0 }
  });

  const [mockupSettings, setMockupSettings] = useState<MockupSettings>({
    background: {
      type: 'solid',
      value: '#ffffff'
    },
    effects: {
      shadow: true,
      reflection: false,
      depth: 50
    },
    layout: {
      arrangement: 'single',
      spacing: 20,
      alignment: 'center'
    },
    export: {
      format: 'PNG',
      quality: 100,
      resolution: {
        width: 1920,
        height: 1080
      }
    }
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageSet = (imageData: string) => {
    setPreviewImage(imageData);
    toast({
      title: "Image loaded successfully",
      description: "Your mockup preview is ready!",
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-accent/20">
      <main className="container mx-auto p-6 space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Transform Your Screenshots
          </h2>
          <p className="text-lg text-muted-foreground">
            Create stunning device mockups in seconds. Perfect for presentations,
            marketing materials, and social media.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <UploadZone onFilesAccepted={(files) => {
                  const reader = new FileReader();
                  reader.onloadend = () => handleImageSet(reader.result as string);
                  reader.readAsDataURL(files[0]);
                }} />
              </TabsContent>

              <TabsContent value="url">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Enter URL</h3>
                  <UrlInput onScreenshot={handleImageSet} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-6">
              <DeviceSelector
                selectedDevice={deviceConfig.type}
                onSelect={(type) => setDeviceConfig({ ...deviceConfig, type })}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Device Settings</h3>
                <DeviceConfigPanel
                  config={deviceConfig}
                  onChange={setDeviceConfig}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mockup Settings</h3>
                <MockupSettingsPanel
                  settings={mockupSettings}
                  onChange={setMockupSettings}
                />
              </div>
            </div>
          </Card>

          <PreviewCanvas
            imageUrl={previewImage}
            deviceConfig={deviceConfig}
            mockupSettings={mockupSettings}
          />
        </div>
      </main>
    </div>
  );
}