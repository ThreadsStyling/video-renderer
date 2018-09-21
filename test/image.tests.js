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

const getFileAsDataUrl = (filename) => {
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
  return getFileAsDataUrl(outFile);
};

const runTestcase = async (testcase) => {
  const {name, assets, filters} = testcase;

  const ffmpegResultDataUrl = await renderFfmpeg(testcase);
  const assetFiles = [];

  for (const asset of assets) {
    assetFiles.push(getFileAsDataUrl(asset));
  }

  const result = await inChrome({
    // debug: true,
    func: async (module, args) => {
      return await module.runTest(...args);
    },
    args: [assetFiles, filters, ffmpegResultDataUrl],
    module: path.join(__dirname, 'image.module.js'),
  });

  const dataUrl = result.canvasResult.dataUrl;
  const outFile = path.join(outDir, `${name}-canvas.png`);
  const data = new Buffer(dataUrl.substr(dataUrl.indexOf(',') + 1), 'base64');
  fs.writeFileSync(outFile, data);

  if (!result.diffResult) {
    throw new Error(`Image dimensions don't match <canvas> = (${reult.canvasResult.width}, ${reult.canvasResult.height}); ffmpeg = (${reult.ffmpegResult.width}, ${reult.ffmpegResult.height})`);
  }

  const dataUrlDiff = result.diffResult.dataUrl;
  const dataUrlAll = result.diffResult.dataUrlCombined;
  const outFileDiff = path.join(outDir, `${name}-diff.png`);
  const outFileAll = path.join(outDir, `${name}-all.png`);
  const dataDiff = new Buffer(dataUrlDiff.substr(dataUrlDiff.indexOf(',') + 1), 'base64');
  const dataAll = new Buffer(dataUrlAll.substr(dataUrlAll.indexOf(',') + 1), 'base64');
  fs.writeFileSync(outFileDiff, dataDiff);
  fs.writeFileSync(outFileAll, dataAll);

  const threshold = 3;
  if (result.diffResult.diff > threshold) {
    throw new Error(`Discrepancy ${result.diffResult.percent} is more than ${threshold}% threshold.`);
  }

  return result.diffResult.percent;
};

const main = async () => {
  const passed = true;

  for (const testcase of testcases) {
    try {
      const percent = await runTestcase(testcase);
      console.log(`✅  Passed [${testcase.name}], difference ${percent}`);
    } catch (error) {
      passed = false;
      console.log(`❌  Failed [${testcase.name}]: ${error.message}`);
      console.error(error);
    };
  }

  if (!passed) {
    process.exit(1);
  }
};

main().then(() => {}, console.error);
