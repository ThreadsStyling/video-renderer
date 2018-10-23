export default async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = document.createElement('img');

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
