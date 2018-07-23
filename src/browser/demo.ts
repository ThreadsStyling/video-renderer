const videoURL = require('../node/__tests__/Video Of People Walking.mp4');
const gifURL = require('../node/__tests__/loop.gif');
const videoContainer = document.createElement('div');
const video = document.createElement('video');
const image = document.createElement('img');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

videoContainer.style.opacity = '0';
videoContainer.style.width = '0';
videoContainer.style.height = '0';
document.body.appendChild(videoContainer);

document.body.appendChild(canvas);

requestAnimationFrame(draw);
let clientWidth = 0,
  clientHeight = 0;
function draw() {
  if (video.clientWidth !== clientWidth || video.clientHeight !== clientHeight) {
    ({clientWidth, clientHeight} = video);
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  }
  ctx!.drawImage(video, 0, 0, clientWidth, clientHeight);
  ctx!.drawImage(image, 200, 100);
  requestAnimationFrame(draw);
}

document.body.appendChild(videoContainer);

videoContainer.appendChild(video);
videoContainer.appendChild(image);
video.autoplay = true;
video.loop = true;
video.src = videoURL;
video.play();
image.src = gifURL;
