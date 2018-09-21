const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const runInChrome = async (code, ...args) => {
  // const browser = await puppeteer.launch({headless: false});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const result = await page.evaluate(code, ...args);

  await browser.close();

  return result;
};

const renderInChrome = async () => {
  const bundle = fs.readFileSync(path.join(__dirname, 'renderInChrome.bundle.js'), 'utf8');
  const code = `

  ${bundle}

  window.RESULT = 1234343;

  window.RESULT;
  `;

  // console.log('b', bundle);
  const result = await runInChrome(code);

  return result;
};

exports.runInChrome = runInChrome;
exports.renderInChrome = renderInChrome;
