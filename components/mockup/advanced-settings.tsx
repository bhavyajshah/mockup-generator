"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedSettingsProps {
  onChange: (settings: any) => void;
}

export function AdvancedSettings({ onChange }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fullPage: false,
    delay: 2000,
    waitForNetworkIdle: true,
    transparentBackground: false,
    css: '',
    hideSelectors: '',
  });

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          Advanced Settings
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="fullPage">Capture Full Page</Label>
          <Switch
            id="fullPage"
            checked={settings.fullPage}
            onCheckedChange={(checked) => handleChange('fullPage', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delay">Capture Delay (ms)</Label>
          <Input
            id="delay"
            type="number"
            value={settings.delay}
            onChange={(e) => handleChange('delay', parseInt(e.target.value))}
            min={0}
            max={10000}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="waitForNetworkIdle">Wait for Network Idle</Label>
          <Switch
            id="waitForNetworkIdle"
            checked={settings.waitForNetworkIdle}
            onCheckedChange={(checked) => handleChange('waitForNetworkIdle', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="transparentBackground">Transparent Background</Label>
          <Switch
            id="transparentBackground"
            checked={settings.transparentBackground}
            onCheckedChange={(checked) => handleChange('transparentBackground', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="css">Custom CSS</Label>
          <Input
            id="css"
            placeholder=".header { display: none; }"
            value={settings.css}
            onChange={(e) => handleChange('css', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hideSelectors">Hide Elements (comma-separated)</Label>
          <Input
            id="hideSelectors"
            placeholder=".cookie-banner, .popup"
            value={settings.hideSelectors}
            onChange={(e) => handleChange('hideSelectors', e.target.value)}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}