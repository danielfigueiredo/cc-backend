'use strict';

const assert = require('chai').assert;
const agentUtil = require('../util/agent-util');
const authUtil = require('../util/auth-util');
const userUtil = require('../util/user-util');


describe('user api test', () => {

  let agent;

  beforeEach(() => agent = agentUtil.create());

  it('should create an user', (done) => {
    userUtil.create(agent, {
      email: 'bobafett@bountyhunters.com',
      password: 'jetpack'
    }).then(() =>
      done()
    ).catch(err => done(err));
  });

  it('should authenticate and get an user', (done) => {
    const newUser = {
      email: 'testuser@cc.com',
      password: '1233'
    };
    authUtil.authenticateNewUser(agent, newUser).then(userId =>
      agent.get(`/users/${userId}`)
        .expect(200)
        .expect(resp => {
          assert.equal(resp.body.email, newUser.email);
          assert.isUndefined(resp.body.password);
        })
    ).then(
      () => done()
    ).catch(
      err => done(err)
    );
  });

});
