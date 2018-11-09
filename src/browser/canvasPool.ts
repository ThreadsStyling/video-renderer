class CanvasPool {
  private canvases: HTMLCanvasElement[] = [];

  /**
   * Get the next available canvas from the pool
   */
  get(): HTMLCanvasElement {
    if (this.canvases.length === 0) {
      this.canvases.push(document.createElement('canvas'));
    }

    return this.canvases.pop() as HTMLCanvasElement;
  }

  /**
   * Return a canvas to the pool. This function will clear the canvas for reuse
   */
  put(canvas: HTMLCanvasElement): void {
    const context = canvas.getContext('2d');

    if (context !== null) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.canvases.push(canvas);
    }
  }

  /**
   * Empty the pool, destroying any references to canvas objects
   */
  dispose(): void {
    this.canvases = [];
  }
}

const canvasPool = new CanvasPool();

export default canvasPool;
