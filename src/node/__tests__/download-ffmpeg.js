const {existsSync} = require('fs');
const downloadBinaries = require('ffbinaries').downloadBinaries;

if (!existsSync(__dirname + '/bin/ffmpeg')) {
  downloadBinaries(['ffmpeg'], {destination: __dirname + '/bin'}, (err) => {
    if (err) throw err;
    else console.log('downloaded');
  });
}
