const fs = require('fs');

try {
  fs.mkdirSync(__dirname + '/browser');
} catch (ex) {
  if (ex.code !== 'EEXIST') {
    throw ex;
  }
}
try {
  fs.mkdirSync(__dirname + '/browser/register');
} catch (ex) {
  if (ex.code !== 'EEXIST') {
    throw ex;
  }
}
try {
  fs.mkdirSync(__dirname + '/node');
} catch (ex) {
  if (ex.code !== 'EEXIST') {
    throw ex;
  }
}

fs.writeFileSync(
  __dirname + '/browser/index.js',
  [`// @generated node generate-public`, ``, `module.exports = require('../lib/browser');`, ``].join('\n'),
);
fs.writeFileSync(
  __dirname + '/browser/index.d.ts',
  [`// @generated node generate-public`, ``, `export * from '../lib/browser';`, ``].join('\n'),
);

fs.writeFileSync(
  __dirname + '/node/index.js',
  [`// @generated node generate-public`, ``, `module.exports = require('../lib/browser');`, ``].join('\n'),
);
fs.writeFileSync(
  __dirname + '/node/index.d.ts',
  [`// @generated node generate-public`, ``, `export * from '../lib/browser';`, ``].join('\n'),
);

fs.readdirSync(__dirname + '/src/browser/filters').forEach((filename) => {
  if (/\.ts$/.test(filename)) {
    fs.writeFileSync(
      __dirname + '/browser/register/' + filename.replace(/\.ts$/, '.js'),
      [
        `// @generated node generate-public`,
        ``,
        `require('../lib/browser/register/${filename.replace(/\.ts$/, '')}');`,
        ``,
      ].join('\n'),
    );
    fs.writeFileSync(
      __dirname + '/browser/register/' + filename.replace(/\.ts$/, '.d.ts'),
      [`// @generated node generate-public`, ``].join('\n'),
    );
  }
});
