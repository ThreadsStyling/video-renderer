import CanvasPool from '../canvasPool';

class MockCanvas {
  getContext = () => ({
    clearRect: () => undefined,
  });
}

document.createElement = jest.fn().mockImplementation((t) => {
  if (t === 'canvas') {
    return new MockCanvas();
  }

  return {};
});

describe('CanvasPool', () => {
  afterEach(() => {
    CanvasPool.dispose();
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
});
