"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.v3 = exports.unitVector = exports.sub = exports.scale = exports.normalise = exports.norm = exports.dot = exports.distance = exports["default"] = exports.cross = exports.angle = exports.add = exports.Vector = void 0;

var normalise = function normalise(v) {
  var norm = this.norm(v);

  if (norm === 0) {
    return v;
  }

  v.x /= norm;
  v.y /= norm;
  v.z /= norm;
  return v;
};

exports.normalise = normalise;

var scale = function scale(scalar, v) {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
    z: v.z * scalar
  };
};

exports.scale = scale;

var angle = function angle(v1, v2) {
  var denom = this.norm(v1) * this.norm(v2);
  var num = this.dot(v1, v2);
  return Math.acos(num / (denom === 0 ? 2 * Math.pi : denom));
};

exports.angle = angle;

var v3 = function v3() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return {
    x: a,
    y: b,
    z: c
  };
};

exports.v3 = v3;

var dot = function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

exports.dot = dot;

var norm = function norm(v1) {
  return Math.sqrt(dot(v1, v1));
};

exports.norm = norm;

var add = function add(v1, v2) {
  var _x, _y, _z;

  _x = v1.x + v2.x;
  _y = v1.y + v2.y;
  _z = v1.z + v2.z;
  return {
    x: _x,
    y: _y,
    z: _z
  };
};

exports.add = add;

var sub = function sub(v1, v2) {
  var _x, _y, _z;

  _x = v1.x - v2.x;
  _y = v1.y - v2.y;
  _z = v1.z - v2.z;
  return {
    x: _x,
    y: _y,
    z: _z
  };
};

exports.sub = sub;

var cross = function cross(v1, v2) {
  var _x = v1.y * v2.z - v1.z * v2.y;

  var _y = v1.z * v2.x - v1.x * v2.z;

  var _z = v1.x * v2.y - v1.y * v2.x;

  return {
    x: _x,
    y: _y,
    z: _z
  };
};

exports.cross = cross;

var distance = function distance(v1, v2) {
  return norm(sub(v1, v2));
};

exports.distance = distance;

var unitVector = function unitVector(v) {
  var n = norm(v);
  var u = scale(1 / n, v);
  return u;
};

exports.unitVector = unitVector;
var Vector = {
  normalise: normalise,
  scale: scale,
  angle: angle,
  v3: v3,
  dot: dot,
  norm: norm,
  add: add,
  sub: sub,
  cross: cross,
  distance: distance,
  unitVector: unitVector
};
exports.Vector = Vector;
var _default = Vector;
exports["default"] = _default;