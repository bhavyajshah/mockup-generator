"use client";

import { Laptop, Smartphone, Tablet, Watch } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DeviceConfig } from '@/lib/types';

interface DeviceSelectorProps {
  selectedDevice: DeviceConfig['type'];
  onSelect: (device: DeviceConfig['type']) => void;
}

export function DeviceSelector({ selectedDevice, onSelect }: DeviceSelectorProps) {
  const devices = [
    { type: 'desktop' as const, icon: Laptop, label: 'Desktop' },
    { type: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { type: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
    { type: 'smartwatch' as const, icon: Watch, label: 'Smartwatch' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {devices.map(({ type, icon: Icon, label }) => (
        <Card
          key={type}
          className={`p-4 flex items-center gap-3 cursor-pointer transition-colors
            ${selectedDevice === type ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
          onClick={() => onSelect(type)}
        >
          <Icon className="w-6 h-6" />
          <span>{label}</span>
        </Card>
      ))}
    </div>
  );
}