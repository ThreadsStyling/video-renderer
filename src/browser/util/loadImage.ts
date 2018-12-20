import LoadAssetOptions, {setCorsMode} from './LoadAssetOptions';

export default async function loadImage(src: string, options: LoadAssetOptions): Promise<HTMLImageElement> {
  const img = document.createElement('img');

  setCorsMode(img, src, options);
  img.src = src;

  if (img.complete && img.naturalHeight !== 0) {
    return img;
  }

  await new Promise<void>((resolve, reject) => {
    img.addEventListener('error', reject);
    img.addEventListener('load', () => resolve());
  });

  return img;
}
