// This code will run in Chrome.

import {Asset, filterComplex, render, ComplexFilter} from '../browser';
import createCanvasAndContext from '../browser/util/createCanvasAndContext';

const draf = async () =>
  new Promise<number>((r) => {
    requestAnimationFrame(() => requestAnimationFrame(r));
  });

exports.processCanvas = async (assetsUrls: string[], filters: ComplexFilter[]) => {
  const assets = await Promise.all(assetsUrls.map(async (url) => Asset.fromImage(url)));
  const {width, height} = assets[0];
  const [canvas] = createCanvasAndContext();

  canvas.width = width;
  canvas.height = height;

  render(canvas, filterComplex(assets, filters));

  await draf();

  const dataUrl = canvas.toDataURL();

  return {
    dataUrl,
    width,
    height,
  };
};

exports.processFfmpeg = async (ffmpegResultDataUrl: any) => {
  const asset = await Asset.fromImage(ffmpegResultDataUrl);

  return {
    dataUrl: ffmpegResultDataUrl,
    width: asset.width,
    height: asset.height,
  };
};

const processDiff = async (canvasResult: any, ffmpegResult: any) => {
  if (canvasResult.width !== ffmpegResult.width || canvasResult.height !== ffmpegResult.height) {
    return null;
  }
  const width: number = canvasResult.width;
  const height: number = canvasResult.height;
  const [canvas, context] = createCanvasAndContext();
  const [asset1, asset2] = await Promise.all([
    Asset.fromImage(canvasResult.dataUrl),
    Asset.fromImage(ffmpegResult.dataUrl),
  ]);

  canvas.width = width;
  canvas.height = height;

  const img1 = asset1.context.getImageData(0, 0, width, height);
  const img2 = asset2.context.getImageData(0, 0, width, height);
  const img3 = context.createImageData(width, height);
  let diff = 0;
  for (let i = 0; i < img1.data.length / 4; i++) {
    const r = Math.abs(img1.data[4 * i + 0] - img2.data[4 * i + 0]);
    const g = Math.abs(img1.data[4 * i + 1] - img2.data[4 * i + 1]);
    const b = Math.abs(img1.data[4 * i + 2] - img2.data[4 * i + 2]);
    const a = Math.abs(img1.data[4 * i + 3] - img2.data[4 * i + 3]);

    // console.log(r, g, b, a);

    diff += r + g + b + a;
    img3.data[4 * i + 0] = r;
    img3.data[4 * i + 1] = g;
    img3.data[4 * i + 2] = b;
    img3.data[4 * i + 3] = 255 - a;
  }
  context.putImageData(img3, 0, 0);

  const normalizedDiff = (100 * diff) / (width * height * 4 * 255);

  const [canvas2, context2] = createCanvasAndContext();

  canvas2.width = width * 3;
  canvas2.height = height;

  context2.drawImage(asset1.canvas, 0, 0);
  context2.drawImage(asset2.canvas, width, 0);
  context2.drawImage(canvas, width * 2, 0);
  context2.fillText('<canvas>', 10, 10);
  context2.fillText('ffmpeg', width + 10, 10);

  return {
    diff: normalizedDiff,
    percent: `${Math.round(normalizedDiff * 100) / 100}%`,
    dataUrl: canvas.toDataURL(),
    dataUrlCombined: canvas2.toDataURL(),
  };
};

/*
const drawImg = (src: string) => {
  const img = document.createElement('img');
  img.src = src;
  document.body.appendChild(img);
};
*/

// declare const FontFace: any;
const installFonts = async (fonts: any) => {
  const style = document.createElement('style');
  style.innerHTML = Object.keys(fonts)
    .map(
      (fontname) => `
    @font-face {
      font-family: '${fontname}';
      src: url('${fonts[fontname]}');
    }
  `,
    )
    .join('\n');
  document.head && document.head.appendChild(style);
};

exports.runTest = async (assetsUrls: any, filters: any, ffmpegResultDataUrl: any, fonts: any) => {
  await installFonts(fonts);
  const [canvasResult, ffmpegResult] = await Promise.all([
    exports.processCanvas(assetsUrls, filters),
    exports.processFfmpeg(ffmpegResultDataUrl),
  ]);
  const diffResult = await processDiff(canvasResult, ffmpegResult);

  return {
    canvasResult,
    ffmpegResult,
    diffResult,
  };
};
