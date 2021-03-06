'use strict';

var SensorModel = require('../models/sensor');
var Sensor = function() {};
var sensor = new Sensor();
var uuid = require('node-uuid');

module.exports.route = function(app) {
  app.get('/sensors', sensor.getSensors);
  app.get('/sensor/:id', sensor.getSensorPerId);
  app.get('/sensor/type/:type/:id', sensor.getSensorPerIdType);
  app.get('/sensors/types', sensor.getSensorTypes);
  app.put('/sensor/register', sensor.registerSensor);
  app.put('/sensor/update/:type/:id', sensor.updateSensor);
};

/*
 * controller
 */
Sensor.prototype.getSensorTypes = function(req, res, next) {
  var sensorModel = new SensorModel();
  sensorModel.sensorsType(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

Sensor.prototype.getSensors = function(req, res, next) {
  var sensorModel = new SensorModel();
  var treeId = req.params.treeId;
  if (!!treeId) {
    sensorModel.sensorsPerTree(req.params, function(result) {
      res.send(result);
    }, function(error) {
      res.send(500, error);
    });
  } else {
    sensorModel.sensors(req.params, function(result) {
      res.send(result);
    }, function(error) {
      res.send(500, error);
    });
  }
  return next();
};

//This is the short way to get sensor information, when you know about sensorType ahead of type
Sensor.prototype.getSensorPerIdType = function(req, res, next) {
  console.log('>>>> Get sensor per id <<<<<');
  var sensorModel = new SensorModel();
  sensorModel.sensorPerIdType(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

//Get sensor perId when we don't know about type
Sensor.prototype.getSensorPerId = function(req, res, next) {
  var sensorModel = new SensorModel();
  sensorModel.sensorPerId(req.params, function(result) {
    res.send(result);
  }, function(error) {
    res.send(500, error);
  });
  return next();
};

Sensor.prototype.registerSensor = function(req, res, next) {
  var sensorModel = new SensorModel();
  var data = JSON.parse(req.body);
  data.id = uuid.v4();
  console.log(data);
  sensorModel.sensorRegister(data, function(result) {
    sensorModel.sensorDetailRegister(data, function(result) {
      res.send({id: data.id});
    }, function(err) {
      res.send(500, {
        result: false,
        code: 500,
        message: err
      });
    });
  }, function(err) {
    res.send(500, {
      result: false,
      code: 500,
      message: err
    });
  });

  return next();
};

Sensor.prototype.updateSensor = function(req, res, next) {
  var sensorModel = new SensorModel();
  //console.log(sensorModel);
  var data = JSON.parse(req.body);
  data.id = req.params.id;
  //var func = getUpdateFunc(parseInt(req.params.type, 10));
  //console.log(func);
  /*var func = sensorModel.waterSensorUpdate;
  func.call(data, function(result) {
    res.send(200);
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });*/
  getUpdateFunc(parseInt(req.params.type, 10), data, function(result) {
    res.send(200);
  }, function(error) {
    res.send(500, {
      result: false,
      code: 500,
      message: 'Internal server error'
    });
  });
  return next();
};

/**
 * Helper function get correct update function based on sensor type
 */
//1. water
//2. light
//3. speed
//4. voice
function getUpdateFunc(type, data, success, failure) {
  var sensorModel = new SensorModel();
  if (type === 1) {
    return sensorModel.waterSensorUpdate(data, success, failure);
  } else if (type === 4) {
    return sensorModel.voiceSensorUpdate(data, success, failure);
  } else  if (type === 3) {
    return sensorModel.speedSensorUpdate(data, success, failure);
  } else {
    return sensorModel.lightSensorUpdate(data, success, failure);
  }
}

