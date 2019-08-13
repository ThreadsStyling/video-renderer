import CanvasPool from '../canvasPool';

class MockCanvas {
  private _tainted = false;
  getContext = () => ({
    clearRect: () => undefined,
    getImageData: () => {
      if (this._tainted) {
        throw new Error('Tainted canvas');
      }
    },
  });
  taint() {
    this._tainted = true;
  }
}

// tslint:disable-next-line: deprecation
document.createElement = jest.fn((t) => {
  if (t === 'canvas') {
    return new MockCanvas();
  }

  return {};
}) as any;

describe('CanvasPool', () => {
  afterEach(() => {
    CanvasPool.clear();
  });

  test('should create a canvas when no canvases are available', () => {
    const addedCanvas = CanvasPool.get();

    expect(addedCanvas).toBeInstanceOf(MockCanvas);
  });

  test('should release canvases when they are put back the pool', () => {
    CanvasPool.get();
    const canvasToRelease = CanvasPool.get();
    CanvasPool.get();
    CanvasPool.get();

    CanvasPool.put(canvasToRelease);

    const canvasFromPool = CanvasPool.get();

    expect(canvasFromPool).toBe(canvasToRelease);
  });

  test('should not release canvases when they are tainted', () => {
    CanvasPool.get();
    const canvasToRelease: any = CanvasPool.get();

    canvasToRelease.taint();
    CanvasPool.put(canvasToRelease);

    const canvasFromPool = CanvasPool.get();

    expect(canvasFromPool).not.toBe(canvasToRelease);
  });
});
