const testcases = require('./image.testcases');
const {execute: inChrome} = require('puppet-master');
const {filterComplex} = require('../lib/node');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'image-tests-out');
try {
  fs.mkdirSync(outDir);
} catch (err) {}

const dataUrlCache = new Map();

const getAssetDataUrl = (filename) => {
  if (!dataUrlCache.has(filename)) {
    dataUrlCache.set(filename, 'data:image/png;base64,' + fs.readFileSync(filename).toString('base64'));
  }

  return dataUrlCache.get(filename);
};

const ffmpegBinary = path.join(__dirname, '..', 'src', 'node', '__tests__', 'bin', 'ffmpeg');
const ffmpeg = async (...args) => {
  const ffmpegProc = spawn(ffmpegBinary, args, {
    stdio: 'ignore'
  });

  return new Promise((resolve, reject) => {
    ffmpegProc.on('error', reject);
    ffmpegProc.on('close', (code) => {
      if (code !== 0) reject(new Error('FFMPEG extited with code ' + code));
      else resolve();
    });
  });
}

const renderFfmpeg = async ({name, assets, filters}) => {
  const inputs = ['-y'];

  for (const asset of assets) {
    inputs.push('-i');
    inputs.push(asset);
  }

  const outFile = path.join(outDir, `${name}-ffmpeg.png`);
  await ffmpeg(...inputs, '-filter_complex', filterComplex(filters), outFile);
};

const main = async () => {
  for (const testcase of testcases) {
    const {name, assets, filters} = testcase;

    await renderFfmpeg(testcase);

    const assetFiles = [];

    for (const asset of assets) {
      assetFiles.push(getAssetDataUrl(asset));
    }

    const result = await inChrome({
      // debug: true,
      func: async (module, [assetFiles, filters]) => {
        const png = await module.renderImage(assetFiles, filters);
        return png;
      },
      args: [assetFiles, filters],
      module: path.join(__dirname, 'image.module.js'),
    });

    const outFile = path.join(outDir, `${name}-canvas.png`);
    const data = new Buffer(result.substr(result.indexOf(',') + 1), 'base64');
    fs.writeFileSync(outFile, data);

    // console.log();
  }
};

main().then(() => {}, console.error);
