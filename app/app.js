'use strict';

const restify = require('restify');
const bluebird = require('bluebird');
const lamb = require('lamb');
const CookieParser = require('restify-cookies');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const database = require('./apis/database-api');
const logger = require('./apis/logger-api');
const configService = require('./services/config-service');
const routers = require('./routers');
const server = restify.createServer({
  name: 'CashCounter',
  log: logger
});


function setup({uploadDir}) {
  server.use(restify.bodyParser({uploadDir}));
  server.use(restify.queryParser());
  server.use(restify.acceptParser(server.acceptable));
  server.use(CookieParser.parse);
  server.use(session({
    name : configService.getAppSessionName(),
    secret : configService.getAppSessionSecret(),
    rolling : true,
    resave : false,
    saveUninitialized : false,
    cookie: {
      maxAge: 1800000
    }
  }));
  server.on('after', restify.auditLogger({
    log: logger,
    body: true
  }));
  server.use(flash());
  server.use(passport.initialize());
  server.use(passport.session());
  server.on('InternalServer', (req, res, err, cb) => {
    logger.error(err);
    return cb();
  });
  routers(server);
}

function startup(config) {
  setup(config);
  return database.connect().then(() =>
    bluebird.promisify(server.listen, {context: server})(config.port)
  );
}

function shutdown() {
  if (!lamb.isNil(server)) {
    server.close();
    database.close();
  }
}

module.exports = {
  startup,
  shutdown
};
