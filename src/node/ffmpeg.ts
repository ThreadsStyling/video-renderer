import {existsSync} from 'fs';
import {spawn} from 'child_process';
const downloadBinaries = require('ffbinaries').downloadBinaries;

const downloaded = existsSync(__dirname + '/bin/ffmpeg') ? null : new Promise<void>((resolve, reject) => {
  downloadBinaries(['ffmpeg'], {destination: __dirname + '/bin'}, (err: any) => {
    if (err) reject(err);
    else resolve();
  });
});
export default async function ffmpeg(...args: string[]) {
  await downloaded;
  const ffmpegProc = spawn(__dirname + '/bin/ffmpeg', args, {stdio: 'inherit'});
  return new Promise((resolve, reject) => {
    ffmpegProc.on('error', reject);
    ffmpegProc.on('close', (code) => {
      if (code !== 0) reject(new Error('FFMPEG extited with code ' + code));
      else resolve();
    });
  });
}