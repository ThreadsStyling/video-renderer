import {spawn} from 'child_process';

export default async function ffmpeg(...args: string[]) {
  const ffmpegProc = spawn(__dirname + '/bin/ffmpeg', args, {stdio: 'ignore'});
  return new Promise((resolve, reject) => {
    ffmpegProc.on('error', reject);
    ffmpegProc.on('close', (code) => {
      if (code !== 0) reject(new Error('FFMPEG extited with code ' + code));
      else resolve();
    });
  });
}
