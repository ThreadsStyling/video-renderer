import {testcases} from './image.testcases';
import {filterComplex} from '../node';
const {execute: inChrome} = require('puppet-master');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'image-tests-out');
try {
  fs.mkdirSync(outDir);
} catch (err) {}

const dataUrlCache = new Map();

const getFileAsDataUrl = (filename: string) => {
  if (!dataUrlCache.has(filename)) {
    dataUrlCache.set(filename, 'data:image/png;base64,' + fs.readFileSync(filename).toString('base64'));
  }

  return dataUrlCache.get(filename);
};

const ffmpegBinary = path.join(__dirname, '..', 'node', '__tests__', 'bin', 'ffmpeg');
const ffmpeg = async (...args: any[]) => {
  const ffmpegProc = spawn(ffmpegBinary, args, {
    // stdio: [0, 1, 2],
    stdio: 'ignore',
  });

  return new Promise((resolve, reject) => {
    ffmpegProc.on('error', (error: Error) => {
      console.error(error); // tslint:disable-line
      reject(error);
    });
    ffmpegProc.on('close', (code: number) => {
      if (code !== 0) reject(new Error('FFMPEG extited with code ' + code));
      else resolve();
    });
  });
};

const renderFfmpeg = async ({name, assets, filters}: any) => {
  const inputs = ['-y'];
  for (const asset of assets) {
    inputs.push('-i');
    inputs.push(asset);
  }
  const outFile = path.join(outDir, `${name}-ffmpeg.png`);
  await ffmpeg(...inputs.concat(['-filter_complex', filterComplex(filters), outFile]));

  return getFileAsDataUrl(outFile);
};

const runTestcase = async (testcase: any) => {
  const {name, assets, filters} = testcase;

  const ffmpegResultDataUrl = await renderFfmpeg(testcase);
  const assetFiles = [];

  for (const asset of assets) {
    assetFiles.push(getFileAsDataUrl(asset));
  }

  const result = await inChrome({
    // debug: true,
    func: async (module: any, args: any) => {
      return await module.runTest(...args); // tslint:disable-line
    },
    args: [assetFiles, filters, ffmpegResultDataUrl],
    module: path.join(__dirname, 'image.module.ts'),
  });

  const dataUrl = result.canvasResult.dataUrl;
  const outFile = path.join(outDir, `${name}-canvas.png`);
  const data = new Buffer(dataUrl.substr(dataUrl.indexOf(',') + 1), 'base64');
  fs.writeFileSync(outFile, data);

  if (!result.diffResult) {
    throw new Error(
      `Image dimensions don't match <canvas> = (${result.canvasResult.width}, ${
        result.canvasResult.height
      }); ffmpeg = (${result.ffmpegResult.width}, ${result.ffmpegResult.height})`,
    );
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

const testNames = new Set();
const main = async () => {
  let passed = true;

  for (const testcase of testcases) {
    if (testNames.has(testcase.name)) {
      throw new Error(`Test case with name [${testcase.name}] already exists.`);
    }
    testNames.add(testcase.name);

    try {
      const percent = await runTestcase(testcase);
      console.log(`✅  Passed [${testcase.name}], difference ${percent}`); // tslint:disable-line
    } catch (error) {
      passed = false;
      console.log(`❌  Failed [${testcase.name}]: ${error.message}`); // tslint:disable-line
      console.error(error); // tslint:disable-line
    }
  }

  if (!passed) {
    process.exit(1);
  }
};

main().then(() => {}, console.error); // tslint:disable-line
