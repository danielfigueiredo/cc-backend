'use strict';

const bluebird = require('bluebird');
const assert = require('chai').assert;
const userService = require('../../../../app/services/user-service');
const encryptionService = require('../../../../app/services/encryption-service');

describe('User services unit test', () => {

  describe('User success scenarios', () => {
    it('should create user with email key', (done) => {
      const password = 'lukeleia';
      userService.validateUser({
        email: 'darth@vader.com',
        password: password
      }).then(
        (validUser) =>
          encryptionService.compare(password, validUser.password).then(
            isEqual => isEqual ? done() : bluebird.reject(
              'Password encryption failed, password used to create user is invalid but should work'
            )
          )
      ).catch(
        err => done(err)
      );
    });
    it('should create user with google key', (done) => {
      userService.validateUser({
        google: 'IUSAIGW23847923L'
      }).then(
        () => done()
      ).catch(
        err => done(err)
      );
    });
    it('should create user with facebook key', (done) => {
      userService.validateUser({
        facebook: 'IUSAIGW23847923L'
      }).then(
        () => done()
      ).catch(
        err => done(err)
      );
    });
  });

  describe('User error scenarios', () => {
    it('should not create user without an object', (done) => {
      userService.validateUser(null).then(
        () => done()
      ).catch(
        err => done(assert.equal(err, 'USER.ERROR.EMPTY_USER'))
      );
    });

    it('should not create user with empty object', (done) => {
      userService.validateUser({}).then(
        () => done()
      ).catch(
        err => done(assert.equal(err, 'USER.ERROR.EMPTY_KEY'))
      );
    });

    it('should not create user with more than one key', (done) => {
      const users = [
        {
          email: 'yoda@jedicounsel.ccom',
          google: '123876JHGATQW'
        },
        {
          email: 'yoda@jedicounsel.ccom',
          facebook: '123876JHGATQW'
        },
        {
          facebook: 'yoda@jedicounsel.ccom',
          google: '123876JHGATQW'
        }
      ];
      bluebird.each(
        users,
        (user) => userService.validateUser(user)
      ).then(
        () => done()
      ).catch(
        err => done(assert.equal(err, 'USER.ERROR.MULTIPLE_KEYS'))
      );
    });

    it('should not create a user with email without password', (done) => {
      userService.validateUser({
        email: 'without@passwrod.com'
      }).then(
        () => done(assert.fail('User was created but didn\'t provide a password'))
      ).catch(
        err => done(assert.equal(err, 'USER.ERROR.EMPTY_PASSWORD'))
      );
    });

    it('should not create users with invalid email', (done) => {
      userService.validateUser({
        email: 'Han solo',
        password: 'IKnow'
      }).then(
        () => done(assert.fail('User was created but has an invalid email'))
      ).catch(
        err => done(assert.equal(err, 'USER.ERROR.INVALID_EMAIL'))
      );
    });

  });

});
