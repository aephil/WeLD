"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translateVec = exports.screenToCentreYPeriodic = exports.screenToCentreY = exports.screenToCentreXPeriodic = exports.screenToCentreX = exports.rotZ = exports.rotY = exports.rotX = exports.randomNumber = exports.randomColour = exports.centreToScreenYPeriodic = exports.centreToScreenY = exports.centreToScreenXPeriodic = exports.centreToScreenX = void 0;

// helper functions
var centreToScreenY = function centreToScreenY(y) {
  var worldHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  return worldHeight / 2 - y;
};

exports.centreToScreenY = centreToScreenY;

var centreToScreenX = function centreToScreenX(x) {
  var worldWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  return x + worldWidth / 2;
};

exports.centreToScreenX = centreToScreenX;

var centreToScreenYPeriodic = function centreToScreenYPeriodic(y) {
  var worldHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var pos = worldHeight / 2 - y;
  pos = pos > 0 ? pos : worldHeight + pos;
  return pos % worldHeight;
};

exports.centreToScreenYPeriodic = centreToScreenYPeriodic;

var centreToScreenXPeriodic = function centreToScreenXPeriodic(x) {
  var worldWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var pos = x + worldWidth / 2;
  pos = pos > 0 ? pos : worldWidth + pos;
  return pos % worldWidth;
};

exports.centreToScreenXPeriodic = centreToScreenXPeriodic;

var screenToCentreX = function screenToCentreX(x) {
  var worldWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  return x - worldWidth / 2;
};

exports.screenToCentreX = screenToCentreX;

var screenToCentreXPeriodic = function screenToCentreXPeriodic(x) {
  var worldWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var pos = x - worldWidth / 2;
  pos = pos > 0 ? pos : worldWidth + pos;
  return pos % worldWidth;
};

exports.screenToCentreXPeriodic = screenToCentreXPeriodic;

var screenToCentreYPeriodic = function screenToCentreYPeriodic(y) {
  var worldHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var pos = worldHeight / 2 - y;
  pos = pos > 0 ? pos : worldHeight + pos;
  return pos % worldHeight;
}; // returns the screen y coordinate equivalent of the user defined coordinate system


exports.screenToCentreYPeriodic = screenToCentreYPeriodic;

var screenToCentreY = function screenToCentreY(y) {
  var worldHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  return worldHeight / 2 - y;
};

exports.screenToCentreY = screenToCentreY;

var randomNumber = function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
};

exports.randomNumber = randomNumber;

var randomColour = function randomColour() {
  return "rgb(" + randomNumber(0, 255) + "," + randomNumber(0, 255) + "," + randomNumber(0, 255) + ")";
};

exports.randomColour = randomColour;

var rotX = function rotX(d, theta) {
  return {
    x: d.x,
    y: d.y * Math.cos(theta) - d.z * Math.sin(theta),
    z: d.z * Math.cos(theta) + d.y * Math.sin(theta)
  };
};

exports.rotX = rotX;

var rotY = function rotY(d, rho) {
  return {
    x: Math.cos(rho) * d.x + Math.sin(rho) * d.z,
    y: d.y,
    z: Math.cos(rho) * d.z - Math.sin(rho) * d.x
  };
};

exports.rotY = rotY;

var rotZ = function rotZ(d, gamma) {
  return {
    x: Math.cos(gamma) * d.x - Math.sin(gamma) * d.y,
    y: Math.sin(gamma) * d.x + Math.cos(gamma) * d.y,
    z: d.z
  };
};

exports.rotZ = rotZ;

var translateVec = function translateVec(d, vec) {
  return {
    x: d.x + vec.x,
    y: d.y + vec.y,
    z: d.z + vec.z
  };
};

exports.translateVec = translateVec;