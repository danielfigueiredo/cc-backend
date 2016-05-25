'use strict';

const userUtil = require('./user-util');


function authenticateUser(agent, email, password) {
  return agent.get(`/auth/login?email=${email}&password=${password}`)
    .expect(302)
    .expect('location', '/');
}

function authenticateNewUser(agent, user) {
  return userUtil.create(agent, user).then(res =>
    authenticateUser(agent, user.email, user.password).then(
      () => res.headers.location
    )
  );
}

module.exports = {
  authenticateUser,
  authenticateNewUser
};
