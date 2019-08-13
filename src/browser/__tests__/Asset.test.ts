import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';
import CanvasPool from '../canvasPool';

const clearRectMock = jest.fn();
const fillRectMock = jest.fn();
const drawImageMock = jest.fn();

class MockCanvas {
  getContext = () => ({
    clearRect: clearRectMock,
    fillRect: fillRectMock,
    drawImage: drawImageMock,
  });
}

const getAsset = (mockFunc?: jest.Mock<unknown>) => {
  const [canvas, context, dispose] = createCanvasAndContext();
  return new Asset(
    0,
    200,
    200,
    canvas,
    context,
    () => {
      context.fillRect(0, 0, 200, 200);
      if (mockFunc) mockFunc();
      return true;
    },
    dispose,
  );
};

const getAssetPromise = async (mockFunc?: jest.Mock<unknown>): Promise<Asset> => {
  return new Promise<Asset>((resolve) => {
    const asset = getAsset(mockFunc);

    setTimeout(() => resolve(asset), 200);
  });
};

describe('Asset', () => {
  beforeEach(() => {
    // tslint:disable-next-line:deprecation
    document.createElement = jest.fn((t) => {
      if (t === 'canvas') {
        return new MockCanvas();
      }

      return {};
    }) as any;
  });

  afterEach(() => {
    CanvasPool.clear();
    jest.resetAllMocks();
  });

  test('should create asset with simple render function', () => {
    const asset = getAsset();
    expect(asset.renderFrame(1)).toBe(true);
    expect(fillRectMock).toBeCalled();
  });

  describe('Asset.withPlaceholder', () => {
    test('should wrap a loading asset and show a placeholder until it is ready', async () => {
      const placeholderMock = jest.fn();
      const realAssetMock = jest.fn();
      const assetPromise = getAssetPromise(realAssetMock);
      const placeholder = getAsset(placeholderMock);

      const wrappedAsset = Asset.withPlaceholder(assetPromise, placeholder);

      wrappedAsset.renderFrame(1);

      expect(placeholderMock).toHaveBeenCalled();
      expect(realAssetMock).not.toBeCalled();

      await assetPromise;

      wrappedAsset.renderFrame(2);

      expect(realAssetMock).toBeCalled();
    });
  });
});
