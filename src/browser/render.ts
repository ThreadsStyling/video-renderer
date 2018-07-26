import Asset from './Asset';

interface RenderState {
  currentTime: number;
}
export default function render(canvas: HTMLCanvasElement, asset?: Asset) {
  if (asset) {
    canvas.width = asset.width;
    canvas.height = asset.height;
  }
  const ctx = canvas.getContext('2d')!;
  const handlers: Array<(state: RenderState) => void> = [];

  let start = Date.now();
  let disposed = false;
  let paused = false;
  let playing = true;
  requestAnimationFrame(draw);
  function draw() {
    if (!asset) {
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
    if (handlers.length) {
      const state = {currentTime: time};
      handlers.forEach((h) => h(state));
    }
    if (paused || disposed) {
      playing = false;
    } else {
      requestAnimationFrame(draw);
    }
  }
  return {
    setAsset(_asset: Asset) {
      if (!asset || (asset.width !== _asset.width || asset.height !== _asset.height)) {
        canvas.width = _asset.width;
        canvas.height = _asset.height;
      }
      asset = _asset;
      if (!playing) {
        playing = true;
        requestAnimationFrame(draw);
      }
    },
    getAsset() {
      return asset;
    },
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
    seek(time: number) {
      start = Date.now() - time;
      if (!playing) {
        playing = true;
        requestAnimationFrame(draw);
      }
    },
    dispose() {
      disposed = true;
    },
    onFrame(handler: (state: RenderState) => void) {
      handlers.push(handler);
      let unsubscribed = false;
      return () => {
        if (unsubscribed) return;
        unsubscribed = true;
        handlers.splice(handlers.indexOf(handler), 1);
      };
    },
  };
}
