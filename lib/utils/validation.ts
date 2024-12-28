import { z } from 'zod';

const deviceEmulationSchema = z.object({
  width: z.number().min(100).max(3840),
  height: z.number().min(100).max(2160),
  deviceScaleFactor: z.number().min(1).max(3).optional(),
  isMobile: z.boolean(),
  hasTouch: z.boolean(),
  isLandscape: z.boolean(),
  userAgent: z.string(),
});

const authenticationSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const clipRegionSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
  width: z.number().min(1),
  height: z.number().min(1),
});

export const screenshotSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  width: z.number().min(100).max(3840).optional(),
  height: z.number().min(100).max(2160).optional(),
  quality: z.number().min(1).max(100).optional(),
  fullPage: z.boolean().optional(),
  device: deviceEmulationSchema.optional(),
  deviceScaleFactor: z.number().min(1).max(3).optional(),
  userAgent: z.string().optional(),
  authentication: authenticationSchema.optional(),
  headers: z.record(z.string()).optional(),
  cookies: z.array(z.object({
    name: z.string(),
    value: z.string(),
    domain: z.string(),
  })).optional(),
  waitUntil: z.array(z.string()).optional(),
  timeout: z.number().min(1000).max(60000).optional(),
  delay: z.number().min(0).max(10000).optional(),
  waitForNetworkIdle: z.boolean().optional(),
  waitForSelector: z.string().optional(),
  evaluateScript: z.string().optional(),
  css: z.string().optional(),
  hideSelectors: z.array(z.string()).optional(),
  imageFormat: z.enum(['jpeg', 'png']).optional(),
  transparentBackground: z.boolean().optional(),
  clip: clipRegionSchema.optional(),
});

export const validateScreenshotRequest = (data: unknown) => {
  try {
    return { 
      success: true, 
      data: screenshotSchema.parse(data) 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid request data'
    };
  }
};