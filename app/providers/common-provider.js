'use strict';

const bluebird = require('bluebird');
const mongoose = bluebird.promisifyAll(require('mongoose'));


function insert(Model, object) {
  return new Model(object).save();
}

function isIdValid(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function findOne(model, filter, projection) {
  return model.findOne(filter, projection);
}

function findById(model, id, projection) {
  return isIdValid(id) ? findOne(model, {'_id': id}, projection) : bluebird.resolve(null);
}

module.exports = {
  insert,
  findById,
  findOne,
  isIdValid
};
