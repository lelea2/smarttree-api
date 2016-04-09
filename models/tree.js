/**
 *  Tree model
 */

'use strict';

var util = require('util');
var Model = require('./base');
var uuid = require('node-uuid');

var TreeModel = function() {};
util.inherits(TreeModel, Model);

TreeModel.prototype.trees = function(params, success, fail) {
  console.log('>>>>>>> Get trees in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM SmartTrees');

  db.query(sql())
    .on('result', function(res) {
      res.on('data', function onRow(row) {
        logger.debug({ 'row': row });
        self.addResult(row);
      })
      .on('error', self.queryError.bind(self))
      .on('end', self.queryEnd.bind(self));
    })
    .on('error', self.resultError.bind(self))
    .on('end', self.resultEnd.bind(self));

  db.end();
};

TreeModel.prototype.treeUpdate = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO Users (userId, email, userName, phoneNum, password, roleId) VALUES (:userId, :email, :userName, :phoneNum, :password, :roleId)');
  db.query(sql({userId: params.userId, email: params.email, userName: params.userName, phoneNum: params.phoneNum, password: params.password, roleId: 2 }))
    .on('result', function(res) {
      res.on('data', function onRow(row) {
        logger.debug({ 'row': row });
        self.setResult(row);
      })
      .on('error', self.queryError.bind(self))
      .on('end', self.queryEnd.bind(self));
    })
    .on('error', self.resultError.bind(self))
    .on('end', self.resultEnd.bind(self));

  db.end();
};

TreeModel.prototype.treeRegister = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('INSERT INTO SmartTrees (id, title, description, address, longitude, latitude, youtubeId) VALUES (:id, :title, :description, :address, :longitude, :latitude, :youtubeId)');
  db.query(sql({id: params.id, title: params.title, description: params.description, address: params.address, longitude: params.longitude, latitude: params.latitude, youtubeId: params.youtubeId}))
    .on('result', function(res) {
      res.on('data', function onRow(row) {
        logger.debug({ 'row': row });
        self.setResult(row);
      })
      .on('error', self.queryError.bind(self))
      .on('end', self.queryEnd.bind(self));
    })
    .on('error', self.resultError.bind(self))
    .on('end', self.resultEnd.bind(self));

  db.end();
};

module.exports = TreeModel;
