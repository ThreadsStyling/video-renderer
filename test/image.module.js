const {Asset, filterComplex, render} = require('../lib/browser');
const createCanvasAndContext = require('../lib/browser/util/createCanvasAndContext').default;

const draf = () => new Promise(r => {
  requestAnimationFrame(() =>
    requestAnimationFrame(r)
  );
});

exports.renderImage = async (assetsUrls, filters) => {
  const assets = await Promise.all(assetsUrls.map((url) => Asset.fromImage(url)));
  const {width, height} = assets[0];
  const [canvas, context] = createCanvasAndContext();

  canvas.width = width;
  canvas.height = height;

  // document.body.appendChild(canvas);

  render(canvas, filterComplex(assets, filters));

  await draf();

  const dataUrl = canvas.toDataURL();

  // const img = document.createElement('img');
  // img.src = dataUrl;
  // document.body.appendChild(img);

  return dataUrl;
};
