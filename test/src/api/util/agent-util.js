'use strict';

const supertest = require('supertest-as-promised');


function create() {
  return supertest.agent('http://localhost:3011/');
}

module.exports = {
  create
};
