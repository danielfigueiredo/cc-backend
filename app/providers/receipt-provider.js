'use strict';

const commonProvider = require('./common-provider');
const model = require('../models').Receipt;


function insert(object) {
  return commonProvider.insert(model, object);
}

module.exports = {
  insert
};
