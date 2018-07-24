var outputCanvas = document.getElementById('output'),
  output = outputCanvas.getContext('2d'),
  bufferCanvas = document.getElementById('buffer'),
  buffer = bufferCanvas.getContext('2d'),
  video = document.getElementById('video'),
  width = outputCanvas.width,
  height = outputCanvas.height,
  interval;

function processFrame() {
  buffer.drawImage(video, 0, 0);

  // this can be done without alphaData, except in Firefox which doesn't like it when image is bigger than the canvas
  var image = buffer.getImageData(0, 0, width, height),
    imageData = image.data,
    alphaData = buffer.getImageData(0, height, width, height).data;

  for (var i = 3, len = imageData.length; i < len; i = i + 4) {
    imageData[i] = alphaData[i - 1];
  }

  output.putImageData(image, 0, 0, 0, 0, width, height);
}

function randomColourVal() {
  return Math.floor(Math.random() * 256);
}

video.addEventListener(
  'play',
  function() {
    clearInterval(interval);
    interval = setInterval(processFrame, 40);
  },
  false,
);

// Firefox doesn't support looping video, so we emulate it this way
video.addEventListener(
  'ended',
  function() {
    video.play();
  },
  false,
);

document.getElementById('randomBg').addEventListener(
  'click',
  function(event) {
    document.body.style.backgroundColor =
      'rgb(' + randomColourVal() + ',' + randomColourVal() + ',' + randomColourVal() + ')';
    event.preventDefault();
  },
  false,
);

document.getElementById('start').addEventListener(
  'click',
  function(event) {
    video.play();
    event.preventDefault();
  },
  false,
);

document.getElementById('stop').addEventListener(
  'click',
  function(event) {
    video.pause();
    clearInterval(interval);
    event.preventDefault();
  },
  false,
);

document.getElementById('toggleProcessing').addEventListener(
  'click',
  function(event) {
    var toShow = video,
      toHide = outputCanvas;

    if (video.style.display == 'block') {
      toShow = outputCanvas;
      toHide = video;
    }

    toShow.style.display = 'block';
    toHide.style.display = 'none';

    event.preventDefault();
  },
  false,
);

var gaJsHost = 'https:' == document.location.protocol ? 'https://ssl.' : 'http://www.';
document.write(
  unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"),
);
