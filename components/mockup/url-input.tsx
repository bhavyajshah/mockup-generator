"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { AdvancedSettings } from './advanced-settings';
import { ScreenshotOptions } from '@/lib/types/screenshot';
import { useToast } from '@/hooks/use-toast';

interface UrlInputProps {
  onScreenshot: (imageData: string) => void;
}

export function UrlInput({ onScreenshot }: UrlInputProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    fullPage: false,
    delay: 2000,
    waitForNetworkIdle: true,
    transparentBackground: false,
    css: '',
    hideSelectors: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare screenshot options
      const options: ScreenshotOptions = {
        url,
        width: 1920,
        height: 1080,
        quality: 80,
        fullPage: advancedSettings.fullPage,
        delay: advancedSettings.delay,
        waitForNetworkIdle: advancedSettings.waitForNetworkIdle,
        transparentBackground: advancedSettings.transparentBackground,
        css: advancedSettings.css || undefined,
        hideSelectors: advancedSettings.hideSelectors ?
          advancedSettings.hideSelectors.split(',').map(s => s.trim()) :
          undefined,
        imageFormat: 'jpeg',
      };

      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to capture screenshot');
      }

      onScreenshot(data.imageData);
      toast({
        title: "Screenshot captured",
        description: "Your screenshot has been successfully captured.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to capture screenshot';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Capturing
              </>
            ) : (
              'Capture'
            )}
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>

      <AdvancedSettings
        onChange={setAdvancedSettings}
      />
    </div>
  );
}