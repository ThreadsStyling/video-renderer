import CanvasPool from '../canvasPool';

type Dispose = () => void;

const createCanvasAndContext = (): [HTMLCanvasElement, CanvasRenderingContext2D, Dispose] => {
  const canvas = CanvasPool.get();
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (!context) {
    throw new Error('Could not get canvas context.');
  }

  return [canvas, context, () => CanvasPool.put(canvas)];
};

export default createCanvasAndContext;
