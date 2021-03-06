/**
 * Comment model
 */

'use strict';

var util = require('util');
var Model = require('./base');

var CommentModel = function() {};
util.inherits(CommentModel, Model);

CommentModel.prototype.comments = function(params, success, fail) {
  console.log('>>>>>>> Get comments in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT * FROM Comments INNER JOIN Users ON Comments.userId = Users.userId');
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

//Getting comments per tree
CommentModel.prototype.commentsPerTree = function(params, success, fail) {
  console.log('>>>>>>> Get comments in DB <<<<<<');
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('SELECT Comments.*, Users.firstName, Users.lastName FROM Comments INNER JOIN Users ON Comments.userId = Users.userId WHERE Comments.treeId=:treeId');
  //console.log(sql({treeId: params.treeId}));
  db.query(sql({treeId: params.treeId}))
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

//Adding comments per tree
CommentModel.prototype.add = function(params, success, fail) {
  var self = this;
  self.init({}, success, fail);
  var db = self.db();
  var logger = self.logger();
  console.log(params);
  var sql = db.prepare('INSERT INTO Comments (userId, comment, rating, treeId, islike) VALUES (:userId, :comment, :rating, :treeId, :islike)');
  db.query(sql({userId: params.userId, comment: params.comment, rating: params.rating, treeId: params.treeId, islike: params.islike }))
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

//Delete comment based on commentId
CommentModel.prototype.deleteComment = function(params, success, fail) {
  var self = this;
  self.init([], success, fail);
  var db = self.db();
  var logger = self.logger();
  var sql = db.prepare('DELETE FROM Comments WHERE id=:commentId');
  db.query(sql({commentId: params.commentId}))
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

module.exports = CommentModel;
