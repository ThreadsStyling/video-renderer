import Asset from './Asset';

export default function render(asset: Asset, canvas: HTMLCanvasElement) {
  canvas.width = asset.width;
  canvas.height = asset.height;
  const ctx = canvas.getContext('2d')!;

  let start = Date.now();
  let disposed = false;
  let paused = false;
  let playing = true;
  requestAnimationFrame(draw);
  function draw() {
    if (paused || disposed) {
      playing = false;
      return;
    }
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
  return {
    isPaused() {
      return paused;
    },
    pause() {
      if (disposed) {
        throw new Error('Cannot pause after dispose');
      }
      paused = true;
    },
    play() {
      if (disposed) {
        throw new Error('Cannot play after dispose');
      }
      paused = false;
      if (!playing) {
        playing = true;
        requestAnimationFrame(draw);
      }
    },
    dispose() {
      disposed = true;
    },
  };
}
