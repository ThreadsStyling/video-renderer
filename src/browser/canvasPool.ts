export interface CanvasPool {
  /**
   * Get the next available canvas from the pool
   */
  get: () => HTMLCanvasElement;
  /**
   * Return a canvas to the pool. This function will clear the canvas for reuse
   */
  put: (canvas: HTMLCanvasElement) => void;
  /**
   * Empty the pool, destroying any references to canvas objects
   */
  clear: () => void;
}

let canvases: HTMLCanvasElement[] = [];

const canvasPool: CanvasPool = {
  get() {
    if (canvases.length === 0) {
      canvases.push(document.createElement('canvas'));
    }

    return canvases.pop() as HTMLCanvasElement;
  },
  put(canvas) {
    const context = canvas.getContext('2d');

    if (context !== null) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvases.push(canvas);
    }
  },
  clear() {
    canvases = [];
  },
};

export default canvasPool;
