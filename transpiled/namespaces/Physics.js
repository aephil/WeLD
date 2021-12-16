"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Physics = void 0;

var _Vector = _interopRequireDefault(require("../modules/physics/Vector.js"));

var _Lattice = _interopRequireDefault(require("../modules/physics/Lattice.js"));

var _Verlet = _interopRequireDefault(require("../modules/physics/Verlet.js"));

var _Units = require("../modules/physics/Units.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Physics = {
  Vector: _Vector["default"],
  lattice: _Lattice["default"],
  verlet: _Verlet["default"],
  boltzmann: _Units.boltzmann
};
exports.Physics = Physics;
var _default = Physics;
exports["default"] = _default;