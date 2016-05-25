'use strict';

const restify = require('restify');
const authRouter = require('./auth-router');
const receiptService = require('../services/receipt-service');


function addRoutes(server, prefix) {
  server.post(
    prefix + '/',
    authRouter.authenticate,
    (req, res, next) => {
      const user = req.user;
      const receiptPath = req.files.receipt.path;
      receiptService.insert(user, receiptPath).then(receipt => {
        res.header('location', receipt._id);
        res.send(201);
        return next();
      }).catch(err => {
        console.log(err);
        next(new restify.errors.InternalServerError(JSON.stringify(err)));
      });
    }
  );
}

module.exports = {
  addRoutes
};
