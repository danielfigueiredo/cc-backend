'use strict';

const sinon = require('sinon');
const fse = require('fs-extra');
const constants = require('./constants');
const logger = require('../../../app/apis/logger-api');
const app = require('../../../app/app');
const database = require('../../../app/apis/database-api');
const configService = require('../../../app/services/config-service');


/**
 * Mock server configuration so we can run against test database.
 */
sinon.stub(configService, 'getDBConnectionURI', () =>
  configService.getByKey('MONGO_TEST_URI') + configService.getByKey('MONGO_TEST_DB')
);

function clearAndCreateDir(dir) {
  fse.removeSync(dir);
  fse.mkdirsSync(dir);
}

/**
 * Start up the server and clean up the database before running tests.
 */
before(function(done) {
  this.timeout(1000);
  const port = configService.getByKey('NODE_TEST_PORT');
  const config = {
    port,
    uploadDir: constants.UPLOAD_TEST_DIR
  };
  clearAndCreateDir(config.uploadDir);
  app.startup(config).then(() => {
    logger.info(
      `Server started at ${new Date().toISOString()} on port ${port}`
    );
    database.dropDatabase();
    logger.info(
      'Test database was successfully cleaned up before execution'
    );
    logger.info('Start running API tests...');
    done();
  });
});

/**
 * Restore mocked methods and shutdown server so gulp task can be
 * terminated.
 */
after(done => {
  app.shutdown();
  configService.getDBConnectionURI.restore();
  done();
});
