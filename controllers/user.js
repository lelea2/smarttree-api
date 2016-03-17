var UserModel = require('../models/user');
var User = function() {};
var user = new User();

module.exports.route = function(app) {
  app.get('/users', user.getUsers);
  app.get('/user/:id', user.getUser);
  app.post('/user/login', user.getUserByEmail);
  app.put('/user/register', user.registerUser);
};

/*
 * controller
 */
User.prototype.getUsers = function(req, res, next) {
  var userModel = new UserModel();
  userModel.users(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(400, error);
  });

  return next();
};

User.prototype.getUser = function(req, res, next) {
  var userModel = new UserModel();
  userModel.user(req.params, function(result) {
    if ((!result) || (Object.getOwnPropertyNames(result).length === 0)) {
      res.send(404, {
        result: false,
        code: 404,
        message: 'Not Found'
      });
    } else {
      res.send(result);
    }
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });

  return next();
};

User.prototype.getUserByEmail = function(req, res, next) {
  var userModel = new UserModel();
  userModel.userByEmail(JSON.parse(req.body), function(result) {
    if ((!result) || (Object.getOwnPropertyNames(result).length === 0)) {
      res.send(404, {
        result: false,
        code: 404,
        message: 'Not Found'
      });
    } else {
      res.send(result);
    }
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });

  return next();
};

User.prototype.registerUser = function(req, res, next) {
  var userModel = new UserModel();
  userModel.userRegister(JSON.parse(req.body), function(result) {
    res.send(200);
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });

  return next();
  return next();
};
