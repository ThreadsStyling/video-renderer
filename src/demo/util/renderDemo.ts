import {join} from 'path';
import {readFileSync} from 'fs';
import {ComplexFilter} from '../../browser';
const {execute} = require('puppet-master');

const assetDir = join(__dirname, '..', '..', '..', 'assets');
const renderDemo = (assets: string[], complexFilters: ComplexFilter[]) =>
  execute({
    debug: true,
    func: (module: any, args: any[]) => {
      module.main(...args);
    },
    args: [
      assets.map(name => 'data:image/png;base64,' + readFileSync(join(assetDir, name), 'base64')),
      complexFilters,
    ],
    module: join(__dirname, 'renderDemo.chrome.ts'),
  }).catch(console.error); // tslint:disable-line

export default renderDemo;
