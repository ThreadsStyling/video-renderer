const fs = require('fs');

try {
  fs.mkdirSync(__dirname + '/src/browser/register');
} catch (ex) {
  if (ex.code !== 'EEXIST') {
    throw ex;
  }
}

fs.readdirSync(__dirname + '/src/browser/filters').forEach((filename) => {
  if (/\.ts$/.test(filename)) {
    fs.writeFileSync(
      __dirname + '/src/browser/register/' + filename,
      [
        `// @generated node generate-filter-register`,
        ``,
        `import {registerFilter} from '../Filters';`,
        `import filter from '../filters/${filename.replace(/\.ts$/, '')}';`,
        ``,
        `registerFilter('${filename.replace(/\.ts$/, '')}', filter);`,
        ``,
      ].join('\n'),
    );
  }
});
