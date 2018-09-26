// Run: ts-node src/demo/text1.ts

import renderDemo from './util/renderDemo';

renderDemo(
  ['image.jpg'],
  [
    {
      inputs: ['0'],
      name: 'drawtext',
      args: {
        fontfile: './assets/Verdana.ttf',
        text: 'SOME TEXT',
        x: '(0 - tw / 2)',
        y: '(0 + 30)',
        fontsize: 72,
        fontcolor: 'white',
        box: 1,
        boxcolor: 'black',
        boxborderw: 10,
      },
    },
  ],
).catch(console.error); // tslint:disable-line
