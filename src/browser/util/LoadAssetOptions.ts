export enum CorsMode {
  Disabled = 'disabled',
  Anonymous = 'anonymous',
  UseCredentials = 'use-credentials',
}

export function setCorsMode(element: HTMLVideoElement | HTMLImageElement, src: string, options: LoadAssetOptions) {
  let corsMode = options.crossOrigin;
  if (!corsMode && /^https?\:\/\//.test(src) && src.indexOf(location.origin) !== 0) {
    corsMode = CorsMode.Anonymous;
  }
  if (corsMode && corsMode !== CorsMode.Disabled) {
    element.crossOrigin = corsMode;
  }
}

export default interface LoadAssetOptions {
  crossOrigin?: CorsMode;
}
