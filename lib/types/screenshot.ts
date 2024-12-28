export interface DeviceEmulation {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile: boolean;
  hasTouch: boolean;
  isLandscape: boolean;
  userAgent: string;
}

export interface Authentication {
  username: string;
  password: string;
}

export interface ClipRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScreenshotOptions {
  url: string;
  width?: number;
  height?: number;
  quality?: number;
  fullPage?: boolean;
  device?: DeviceEmulation;
  deviceScaleFactor?: number;
  userAgent?: string;
  authentication?: Authentication;
  headers?: Record<string, string>;
  cookies?: Array<{
    name: string;
    value: string;
    domain: string;
  }>;
  waitUntil?: string[];
  timeout?: number;
  delay?: number;
  waitForNetworkIdle?: boolean;
  waitForSelector?: string;
  evaluateScript?: string;
  css?: string;
  hideSelectors?: string[];
  imageFormat?: 'jpeg' | 'png';
  transparentBackground?: boolean;
  clip?: ClipRegion;
}

export interface ScreenshotResponse {
  success: boolean;
  imageData?: string;
  url?: string;
  error?: string;
  metadata?: {
    timestamp: string;
    format: string;
    dimensions: {
      width: number;
      height: number;
    };
    size: number;
  };
}