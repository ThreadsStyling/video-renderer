import AssetKind from './AssetKind';
import Asset from './Asset';
import getVideo from './loadVideo';

export default async function loadAsset(url: string, kind: AssetKind): Promise<Asset> {
  const bufferCanvas = document.createElement('canvas');
  const buffer = bufferCanvas.getContext('2d')!;
  switch (kind) {
    case AssetKind.Video:
      const video = await getVideo(url);
      bufferCanvas.width = video.videoWidth;
      bufferCanvas.height = video.videoHeight;
      let seeking = false;

      return {
        kind: AssetKind.Video,
        url,
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        getFrame(timestamp) {
          const t = timestamp % video.duration;
          if (Math.abs(video.currentTime - t) > 0.2 && !seeking && video.seekable) {
            seeking = true;
            setTimeout(() => {
              seeking = false;
            }, 100);
            for (let i = 0; i < video.seekable.length; i++) {
              if (video.seekable.start(i) < t && video.seekable.end(i) > t) {
                video.currentTime = t;
                break;
              }
            }
          }
          buffer.drawImage(video, 0, 0);
          return {ctx: buffer, canvas: bufferCanvas};
        },
      };
    case AssetKind.VideoWithAlpha:
      const fullVideo = await loadAsset(url, AssetKind.Video);
      const width = fullVideo.width;
      const height = fullVideo.height / 2;
      bufferCanvas.width = width;
      bufferCanvas.height = height;
      return {
        kind: AssetKind.VideoWithAlpha,
        url,
        width,
        height,
        duration: fullVideo.duration,
        getFrame(timestamp) {
          const rawFrame = fullVideo.getFrame(timestamp);
          const image = rawFrame.ctx.getImageData(0, 0, width, height);
          const imageData = image.data;
          const alphaData = rawFrame.ctx.getImageData(0, height, width, height).data;

          for (let i = 3; i < imageData.length; i += 4) {
            imageData[i] = alphaData[i - 1];
          }
          buffer.putImageData(image, 0, 0, 0, 0, width, height);
          return {ctx: buffer, canvas: bufferCanvas};
        },
      };
  }
}
