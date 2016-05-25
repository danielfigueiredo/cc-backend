'use strict';

const logger = require('../../../../app/apis/logger-api');
const agentUtil = require('../util/agent-util');
const authUtil = require('../util/auth-util');
const assert = require('chai').assert;
const fs = require('fs');
const constants = require('../constants');
const bluebird = require('bluebird');


describe('Receipt API tests', () => {

  describe('Receipt upload success scenarios', () => {

    let agent;

    beforeEach(() => agent = agentUtil.create());

    it('should upload a receipt for a user', (done) => {
      const user = {
        email: 'han.solo@starwars.com',
        password: 'IKnow'
      };
      authUtil.authenticateNewUser(agent, user).then(() =>
        agent.post('/receipts')
          .attach('receipt', 'test/src/api/receipt/payloads/receipt-1.png')
          .expect(201)
          .expect(res =>
            assert.isNotNull(res.headers.location)
          )
      ).then(() =>
        bluebird.promisify(fs.rmdir, {context: fs})(constants.UPLOAD_TEST_DIR)
      ).then(() =>
        done()
      ).catch(err => {
        if (err.code === 'ENOTEMPTY') {
          logger.error('Server should delete uploaded files after they are saved');
        }
        done(err);
      });
    });

    // it('should extract the total from a receipt', (done) => {
    //   const user = {
    //     email: 'chewie@falcon.com',
    //     password: 'mmmmrraaaaa'
    //   };
    //   authUtil.authenticateNewUser(agent, user).then(() =>
    //     agent.post('/receipts')
    //       .attach('receipt', 'test/src/api/receipt/payloads/receipt-1.png')
    //       .expect(201)
    //       .expect(res =>
    //         assert.isNotNull(res.headers.location)
    //       )
    //       .then(res => res.headers.location)
    //   ).then(id =>
    //     agent.get('/receipts/' + id)
    //       .expect(200)
    //   ).catch(err => done(err));
    // });
  });
});
