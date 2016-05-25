'use strict';

const bluebird = require('bluebird');
const receiptProvider = require('../providers/receipt-provider');
const imageService = require('./image-service');
// const levenshtein = require('fast-levenshtein');
const fse = require('fs-extra');


// function extractTotal(text) {
//   let highest = 0;
//   text.split(' ').forEach((token, i) => {
//     const result = /[0-9,]{1,99}\.[0-9]{2}/g.exec(token);
//     if (result) {
//       const value = parseFloat(result.join(''));
//       if (highest < value) {
//         highest = value;
//       }
//     }
//   });
//   return highest;
// }

function removeTmpReceiptFile(receiptPath) {
  return bluebird.promisify(fse.remove, {context: fse})(receiptPath);
}

function insert(user, receiptPath) {
  return imageService.read(receiptPath).then(receiptObj => {
    // const total = extractTotal(receiptObj.output);
    return receiptProvider.insert({
      user: user._id,
      receipt: receiptObj.stream,
      output: receiptObj.output
    });
  }).then(receipt =>
    removeTmpReceiptFile(receiptPath).thenReturn(receipt._id)
  ).catch(err =>
    removeTmpReceiptFile(receiptPath).thenReturn(bluebird.reject(err))
  );
}

module.exports = {
  insert
};
