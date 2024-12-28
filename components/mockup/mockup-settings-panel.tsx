"use client";

import { MockupSettings } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface MockupSettingsPanelProps {
  settings: MockupSettings;
  onChange: (settings: MockupSettings) => void;
}

export function MockupSettingsPanel({ settings, onChange }: MockupSettingsPanelProps) {
  const updateSettings = (updates: Partial<MockupSettings>) => {
    onChange({ ...settings, ...updates });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Background</h3>
        <Select 
          value={settings.background.type}
          onValueChange={(value: MockupSettings['background']['type']) => 
            updateSettings({ background: { ...settings.background, type: value }})
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
          </SelectContent>
        </Select>
        {settings.background.type === 'solid' && (
          <Input
            type="color"
            value={settings.background.value}
            onChange={(e) => updateSettings({ 
              background: { ...settings.background, value: e.target.value }
            })}
          />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Effects</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Shadow</Label>
            <Switch
              checked={settings.effects.shadow}
              onCheckedChange={(checked) => 
                updateSettings({ effects: { ...settings.effects, shadow: checked }})
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Reflection</Label>
            <Switch
              checked={settings.effects.reflection}
              onCheckedChange={(checked) => 
                updateSettings({ effects: { ...settings.effects, reflection: checked }})
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Depth ({settings.effects.depth})</Label>
            <Slider
              value={[settings.effects.depth]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => 
                updateSettings({ effects: { ...settings.effects, depth: value }})
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Layout</h3>
        <Select 
          value={settings.layout.arrangement}
          onValueChange={(value: MockupSettings['layout']['arrangement']) => 
            updateSettings({ layout: { ...settings.layout, arrangement: value }})
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="group">Group</SelectItem>
            <SelectItem value="cascade">Cascade</SelectItem>
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <Label>Spacing ({settings.layout.spacing}px)</Label>
          <Slider
            value={[settings.layout.spacing]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => 
              updateSettings({ layout: { ...settings.layout, spacing: value }})
            }
          />
        </div>
        <Select 
          value={settings.layout.alignment}
          onValueChange={(value: MockupSettings['layout']['alignment']) => 
            updateSettings({ layout: { ...settings.layout, alignment: value }})
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Export Settings</h3>
        <Select 
          value={settings.export.format}
          onValueChange={(value: MockupSettings['export']['format']) => 
            updateSettings({ export: { ...settings.export, format: value }})
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PNG">PNG</SelectItem>
            <SelectItem value="JPG">JPG</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="SVG">SVG</SelectItem>
            <SelectItem value="WebP">WebP</SelectItem>
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <Label>Quality ({settings.export.quality}%)</Label>
          <Slider
            value={[settings.export.quality]}
            min={1}
            max={100}
            step={1}
            onValueChange={([value]) => 
              updateSettings({ export: { ...settings.export, quality: value }})
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Width</Label>
            <Input
              type="number"
              value={settings.export.resolution.width}
              onChange={(e) => updateSettings({ 
                export: { 
                  ...settings.export, 
                  resolution: { 
                    ...settings.export.resolution, 
                    width: Number(e.target.value) 
                  }
                }
              })}
            />
          </div>
          <div>
            <Label>Height</Label>
            <Input
              type="number"
              value={settings.export.resolution.height}
              onChange={(e) => updateSettings({ 
                export: { 
                  ...settings.export, 
                  resolution: { 
                    ...settings.export.resolution, 
                    height: Number(e.target.value) 
                  }
                }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}