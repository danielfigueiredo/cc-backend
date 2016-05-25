'use strict';

const assert = require('chai').assert;


function create(agent, user) {
  return agent.post('/users')
    .send(user)
    .expect(201)
    .expect(resp =>
      assert.isNotNull(resp.headers.location)
    );
}

module.exports = {
  create
};
