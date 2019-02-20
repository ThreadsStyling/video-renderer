import {filterComplex, render, Asset} from '../browser';
import createCanvasAndContext from '../browser/util/createCanvasAndContext';

const canvas = document.createElement('canvas');

canvas.style.width = '640px';
canvas.style.height = '1136px';

canvas.style.margin = 'auto';
canvas.style.display = 'block';
document.body.appendChild(canvas);

const [placeholderCanvas, placeholderContext] = createCanvasAndContext();

const createPlaceholder = (duration: number, width: number, height: number) => {
  return new Asset(
    duration,
    width,
    height,
    placeholderCanvas,
    placeholderContext,
    (timestamp, isInitialRender) => {
      placeholderCanvas.width = width;
      placeholderCanvas.height = height;

      const oldFillStyle = placeholderContext.fillStyle;
      placeholderContext.fillStyle = 'rgba(0, 0, 0, 0.3)';
      placeholderContext.clearRect(0, 0, width, height);
      placeholderContext.fillRect(0, 0, width, height);
      placeholderContext.fillStyle = oldFillStyle;

      return isInitialRender;
    },
    () => undefined,
  );
};

const delayAsset = async (asset: Promise<Asset>, seconds: number) =>
  new Promise<Asset>((resolve) => {
    setTimeout(() => resolve(asset), seconds * 1000);
  });

Promise.all([
  Asset.withPlaceholder(
    delayAsset(Asset.fromImage(require('../../assets/image.jpg')), 3),
    createPlaceholder(0, 640, 1136),
  ),
  Asset.withPlaceholder(
    delayAsset(Asset.fromImage(require('../../assets/servers.png')), 2),
    createPlaceholder(0, 426, 242),
  ),
  Asset.withPlaceholder(
    delayAsset(Asset.fromImage(require('../../assets/image.jpg')), 1),
    createPlaceholder(0, 640, 1136),
  ),
])
  .then((inputs) => {
    render(
      canvas,
      filterComplex(inputs, [
        {
          inputs: ['0'],
          name: 'crop',
          args: {
            w: 200,
            h: 200,
            x: 100,
            y: 100,
          },
          outputs: ['c1'],
        },
        {
          inputs: ['1'],
          name: 'crop',
          args: {
            w: 200,
            h: 200,
            x: 0,
            y: 0,
          },
          outputs: ['c2'],
        },
        {
          inputs: ['c1', 'c2'],
          name: 'blend',
          args: {
            c0_mode: 'multiply',
          },
          outputs: ['m'],
        },
        {
          inputs: ['2', 'm'],
          name: 'overlay',
          args: {x: 100, y: 100},
        },
      ]),
    );
  })
  .catch((err) => console.error(err));
