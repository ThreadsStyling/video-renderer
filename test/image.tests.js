const testcases = require('./image.testcases');
const {execute: inChrome} = require('puppet-master');
const fs = require('fs');
const path = require('path');

const dataUrlCache = new Map();

const getAssetDataUrl = (filename) => {
  if (!dataUrlCache.has(filename)) {
    dataUrlCache.set(filename, 'data:image/png;base64,' + fs.readFileSync(filename).toString('base64'));
  }

  return dataUrlCache.get(filename);
};

const main = async () => {
  for (const testcase of testcases) {
    const {assets, filters} = testcase;
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

    const outFile = path.join(__dirname, 'test.png');
    const data = new Buffer(result.substr(result.indexOf(',') + 1), 'base64');
    fs.writeFileSync(outFile, data);

    // console.log();
  }
};

main().then(() => {}, console.error);
