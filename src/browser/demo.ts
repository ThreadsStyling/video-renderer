// based on https://jakearchibald.com/scratch/alphavid/
// and https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

import AssetKind from './AssetKind';
import Asset from './Asset';
import loadAsset from './loadAsset';
import overlay from './filters/overlay';

function write(asset: Asset, canvas: HTMLCanvasElement) {
  canvas.width = asset.width;
  canvas.height = asset.height;
  const ctx = canvas.getContext('2d')!;

  let start = Date.now();
  requestAnimationFrame(draw);
  function draw() {
    const now = Date.now();
    let time = (now - start) / 1000;
    if (time > asset.duration) {
      time = 0;
      start = now;
    }
    const frame = asset.getFrame(time);
    ctx.clearRect(0, 0, asset.width, asset.height);
    ctx.drawImage(frame.canvas, 0, 0);
    requestAnimationFrame(draw);
  }
}
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
Promise.all([
  loadAsset(require('../node/__tests__/Video Of People Walking.mp4'), AssetKind.Video),
  loadAsset(require('../node/__tests__/loop.mp4'), AssetKind.VideoWithAlpha),
]).then(([backgroundVideo, overlayVideo]) => {
  write(
    overlay([backgroundVideo, overlayVideo], {
      x: 500,
      y: 100,
    })[0],
    canvas,
  );
});

// import getVideo from './loadVideo';

// const videoURL = require('../node/__tests__/Video Of People Walking.mp4');

// const bufferCanvas = document.createElement('canvas');
// const buffer = bufferCanvas.getContext('2d')!;

// const background = getVideo(videoURL);
// const gif = getVideo(require('./compressed.mp4'));

// document.body.appendChild(canvas);

// requestAnimationFrame(draw);
// let clientWidth = 488,
//   clientHeight = 244;
// canvas.width = clientWidth;
// canvas.height = clientHeight;
// bufferCanvas.width = clientWidth;
// bufferCanvas.height = clientHeight * 2;
// function draw() {
//   // if (gif.clientWidth !== clientWidth || gif.clientHeight !== clientHeight) {
//   //   ({clientWidth, clientHeight} = gif);
//   //   canvas.width = clientWidth;
//   //   canvas.height = clientHeight;
//   //   bufferCanvas.width = clientWidth;
//   //   bufferCanvas.height = clientHeight;
//   // }
//   // console.log({clientWidth, clientHeight});
//   if (!clientWidth) {
//     setTimeout(draw, 100);
//     return;
//   }
//   ctx.drawImage(background, 0, 0, clientWidth, clientHeight);

//   buffer.drawImage(gif, 0, 0, clientWidth, clientHeight * 2);
//   const image = buffer.getImageData(0, 0, clientWidth, clientHeight);
//   const imageData = image.data;
//   const alphaData = buffer.getImageData(0, clientHeight, clientWidth, clientHeight).data;

//   for (let i = 3; i < imageData.length; i += 4) {
//     // console.log(imageData[i], alphaData[i - 1]);
//     imageData[i] = alphaData[i - 1];
//   }
//   ctx.putImageData(image, 0, 0, 0, 0, clientWidth, clientHeight);

//   // ctx!.drawImage(gif, 200, 100);
//   requestAnimationFrame(draw);
// }
