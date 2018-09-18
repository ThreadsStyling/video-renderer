export default async function getImage (src: string): Promise<HTMLImageElement> {
  const img = document.createElement('img');

  img.src = src;

  if (img.complete && img.naturalHeight !== 0) {
    return img;
  }

  await new Promise((resolve, reject) => {
    img.addEventListener('error', (err) => reject(err));
    img.addEventListener('load', resolve);
  });

  return img;
}
