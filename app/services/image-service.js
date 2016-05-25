'use strict';

const bluebird = require('bluebird');
const imageMagick = require('imagemagick-native');
const fs = require('fs');
const childProcess = require('child_process');
const logger = require('../apis/logger-api');


function read(path) {
  return new bluebird((resolve, reject) => {
    let output = '';
    const tesseract = childProcess.spawn('tesseract', [
      'stdin',
      'stdout'
    ]);
    const fileStream = fs.createReadStream(path);
    fileStream.pipe(imageMagick.streams.convert({
        format: 'TIFF',
        quality: 10
      })).pipe(tesseract.stdin);
    tesseract.stdout.on('data', (data) => {
      const dataStr = data.toString().trim();
      output += dataStr;
    });
    tesseract.on('close', (err) => {
      if (err) {
        logger.error(err);
        return reject('RECEIPT.READ_ERROR');
      }
      resolve({
        stream: fileStream.read(),
        output: output.replace(/\n/g, '')
      });
    });
    tesseract.on('error', err => {
      logger.error(err);
      reject('RECEIPT.READ_ERROR');
    });
  });
}

module.exports = {
  read
};
