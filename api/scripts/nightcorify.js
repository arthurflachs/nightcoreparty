#!/usr/bin/env node

const ffmpeg = require('fluent-ffmpeg');

// ffmpeg -i ./lipdub.mp3 -af asetrate=44100*1.3,aresample=44100 output.mp3
const nightcorify = (input, outStream) =>
  new Promise(resolve =>
    ffmpeg(input)
      .audioFilters(
        'asetrate=44100*1.4',
        'aresample=44100',
        'atempo=0.91',
      )
      .format('mp3')
      //.on('start', function() { console.log('👨🏻‍🔬 Nightcorification begun...'); })
      //.on('progress', function({ percent }) { console.log(`Processing: ${percent}% done`); })
      .on('stderr', function(error) { console.error('Stderr output : ' + error); })
      .on('error', function(error) { console.error('Cannot process file : ' + error.message); })
      .pipe(outStream)
  );

module.exports = nightcorify;
