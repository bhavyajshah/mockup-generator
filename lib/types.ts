import { z } from 'zod';

export const DeviceConfigSchema = z.object({
  type: z.enum(['desktop', 'tablet', 'mobile', 'smartwatch']),
  model: z.string(),
  orientation: z.enum(['portrait', 'landscape']),
  color: z.string(),
  scale: z.number().min(0.1).max(2),
  position: z.object({
    x: z.number(),
    y: z.number()
  })
});

export const MockupSettingsSchema = z.object({
  background: z.object({
    type: z.enum(['solid', 'gradient', 'image', 'environment']),
    value: z.string()
  }),
  effects: z.object({
    shadow: z.boolean(),
    reflection: z.boolean(),
    depth: z.number().min(0).max(100)
  }),
  layout: z.object({
    arrangement: z.enum(['single', 'group', 'cascade']),
    spacing: z.number().min(0).max(100),
    alignment: z.enum(['left', 'center', 'right'])
  }),
  export: z.object({
    format: z.enum(['PNG', 'JPG', 'PDF', 'SVG', 'WebP']),
    quality: z.number().min(1).max(100),
    resolution: z.object({
      width: z.number().min(100).max(8000),
      height: z.number().min(100).max(8000)
    })
  })
});

export type DeviceConfig = z.infer<typeof DeviceConfigSchema>;
export type MockupSettings = z.infer<typeof MockupSettingsSchema>;