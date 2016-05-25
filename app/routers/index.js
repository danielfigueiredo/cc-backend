'use strict';

const userRouter = require('./user-router');
const authRouter = require('./auth-router');
const receiptRouter = require('./receipt-router');


module.exports = (server) => {
  authRouter.addRoutes(server, '/auth');
  userRouter.addRoutes(server, '/users');
  receiptRouter.addRoutes(server, '/receipts');
};
