"use client";

import { DeviceConfig } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface DeviceConfigPanelProps {
  config: DeviceConfig;
  onChange: (config: DeviceConfig) => void;
}

export function DeviceConfigPanel({ config, onChange }: DeviceConfigPanelProps) {
  const updateConfig = (updates: Partial<DeviceConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Model</Label>
        <Select value={config.model} onValueChange={(value) => updateConfig({ model: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {config.type === 'desktop' && (
              <>
                <SelectItem value="macbook-pro">MacBook Pro</SelectItem>
                <SelectItem value="macbook-air">MacBook Air</SelectItem>
                <SelectItem value="surface">Surface Laptop</SelectItem>
              </>
            )}
            {config.type === 'mobile' && (
              <>
                <SelectItem value="iphone-15">iPhone 15</SelectItem>
                <SelectItem value="pixel-8">Pixel 8</SelectItem>
                <SelectItem value="galaxy-s24">Galaxy S24</SelectItem>
              </>
            )}
            {/* Add more device models based on type */}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Orientation</Label>
        <Select 
          value={config.orientation} 
          onValueChange={(value: 'portrait' | 'landscape') => updateConfig({ orientation: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="landscape">Landscape</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <Input 
          type="color" 
          value={config.color}
          onChange={(e) => updateConfig({ color: e.target.value })}
          className="h-10 w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Scale ({config.scale.toFixed(1)}x)</Label>
        <Slider
          value={[config.scale]}
          min={0.1}
          max={2}
          step={0.1}
          onValueChange={([value]) => updateConfig({ scale: value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">X</Label>
            <Input
              type="number"
              value={config.position.x}
              onChange={(e) => updateConfig({ 
                position: { ...config.position, x: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label className="text-sm">Y</Label>
            <Input
              type="number"
              value={config.position.y}
              onChange={(e) => updateConfig({ 
                position: { ...config.position, y: Number(e.target.value) }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}