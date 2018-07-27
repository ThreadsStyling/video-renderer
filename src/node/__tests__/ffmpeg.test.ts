import {sync as rimraf} from 'rimraf';
import ffmpeg from './ffmpeg';
import filterComplex from '../filterComplex';

jest.setTimeout(1200000);

test('ffmpeg', async () => {
  rimraf(__dirname + '/../../../assets/generated/output.mp4');
  await ffmpeg(
    '-i',
    __dirname + '/../../../assets/Video Of People Walking.mp4',
    '-movflags',
    'faststart',
    '-filter:v',
    'setpts=0.1*PTS',
    __dirname + '/../../../assets/generated/output.mp4',
  );
});

// see https://www.youtube.com/watch?v=hElDsyuAQDA for
// chaining video filters
test('ffmpeg overlay', async () => {
  rimraf(__dirname + '/../../../assets/generated/output-overlay.mp4');
  await ffmpeg(
    '-i',
    __dirname + '/../../../assets/Video Of People Walking.mp4',
    '-ignore_loop',
    '0',
    '-i',
    __dirname + '/../../../assets/loop.gif',
    '-movflags',
    'faststart',
    '-filter_complex',
    filterComplex([
      {
        inputs: ['0', '1'],
        name: 'overlay',
        args: {
          x: 500,
          y: 100,
        },
      },
      {
        name: 'trim',
        args: {
          start: 0,
          end: 5,
        },
      },
    ]),
    __dirname + '/../../../assets/generated/output-overlay.mp4',
  );
});

test('image overlay', async () => {
  rimraf(__dirname + '/../../../assets/generated/image-overlay.jpg');
  await ffmpeg(
    '-i',
    __dirname + '/../../../assets/image.jpg',
    '-i',
    __dirname + '/../../../assets/threads-logo-gold.png',
    '-filter_complex',
    filterComplex([
      {
        inputs: ['0', '1'],
        name: 'overlay',
        args: {
          x: 500,
          y: 100,
        },
      },
    ]),
    __dirname + '/../../../assets/generated/image-overlay.jpg',
  );
});
