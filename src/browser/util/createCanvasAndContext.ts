const createCanvasAndContext = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (!context) {
    throw new Error('Could not get canvas context.');
  }

  return [canvas, context];
};

export default createCanvasAndContext;
