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
        x: 100,
        y: 100,
        fontsize: 72,
        fontcolor: 'white',
        box: 1,
        boxcolor: 'black',
        boxborderw: 10,
      },
    },
  ],
).catch(console.error); // tslint:disable-line
