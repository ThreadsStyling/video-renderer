import {sync as rimraf} from 'rimraf';
import ffmpeg from './ffmpeg';
import extractAlpha from '../extractAlpha';
import filterComplex from '../filterComplex';

jest.setTimeout(1200000);

test('gif', async () => {
  rimraf(__dirname + '/../../../assets/generated/loop.mp4');
  await ffmpeg(
    '-i',
    __dirname + '/../../../assets/loop.gif',
    '-movflags',
    'faststart',
    // pix_fmt is needed for converting gifs
    '-pix_fmt',
    'yuv420p',
    '-filter_complex',
    filterComplex(extractAlpha('0')),
    __dirname + '/../../../assets/generated/loop.mp4',
  );
});
