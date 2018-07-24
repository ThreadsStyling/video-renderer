import {sync as rimraf} from 'rimraf';
import ffmpeg from '../ffmpeg';
import filterComplex from '../filterComplex';
import {FilterInputKind} from '../../shared/ComplexFilter';

jest.setTimeout(1200000);

test('ffmpeg', async () => {
  rimraf(__dirname + '/output.mp4');
  await ffmpeg(
    '-i',
    __dirname + '/Video Of People Walking.mp4',
    '-movflags',
    'faststart',
    '-filter:v',
    'setpts=0.1*PTS',
    __dirname + '/output.mp4',
  );
});

// see https://www.youtube.com/watch?v=hElDsyuAQDA for
// chaining video filters
test('ffmpeg overlay', async () => {
  rimraf(__dirname + '/output-overlay.mp4');
  await ffmpeg(
    '-i',
    __dirname + '/Video Of People Walking.mp4',
    '-ignore_loop',
    '0',
    '-i',
    __dirname + '/loop.gif',
    '-movflags',
    'faststart',
    '-filter_complex',
    filterComplex([
      {
        inputs: [{name: '0', kind: FilterInputKind.Both}, {name: '1', kind: FilterInputKind.Both}],
        outputs: ['overlaid'],
        name: 'overlay',
        args: {
          x: 500,
          y: 100,
        },
      },
      {
        inputs: [{name: 'overlaid', kind: FilterInputKind.Both}],
        outputs: [],
        name: 'trim',
        args: {
          start: 0,
          end: 5,
        },
      },
    ]),
    __dirname + '/output-overlay.mp4',
  );
});
