const {join} = require('path');

const assetDir = join(__dirname, '..', 'assets');

module.exports = [
  {
    name: 'overlay-simple',
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
    filters: [{
      inputs: ['0', '1'],
      name: 'overlay',
      args: {
        x: 0,
        y: 0,
      },
    }],
  },
];
