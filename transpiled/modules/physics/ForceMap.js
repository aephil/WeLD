"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valenceAngle = exports.testForce = exports.spring = exports.lennardJones = exports.initValence = exports.forceMap = exports["default"] = void 0;

var _Vector = _interopRequireDefault(require("./Vector.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var testForce = function testForce(d, data, params) {
  // just for testing purposes
  return [[d.id, {
    x: 100,
    y: 100,
    z: 0
  }]];
};

exports.testForce = testForce;

var spring = function spring(d, data, params) {
  var _params = _slicedToArray(params, 3),
      k = _params[0],
      nodesLen = _params[1],
      neighbourIndex = _params[2];

  var d2 = data[neighbourIndex];
  var dx = d.ri.x - d2.ri.x;
  var dy = d.ri.y - d2.ri.y;
  var dz = d.ri.z - d2.ri.z;
  var separation = {
    x: dx,
    y: dy,
    z: dz
  };

  var unitSeparation = _Vector["default"].unitVector(separation);

  var equilibrium = _Vector["default"].scale(nodesLen, unitSeparation);

  var extension = _Vector["default"].sub(separation, equilibrium);

  var fx = -k * extension.x;
  var fy = -k * extension.y;
  var fz = -k * extension.z; //debugging

  return [[d.id, {
    x: fx,
    y: fy,
    z: fz
  }]];
};

exports.spring = spring;

var valenceAngle = function valenceAngle(d, data, params) {
  var _params2 = _slicedToArray(params, 4),
      k = _params2[0],
      eqAngle = _params2[1],
      index1 = _params2[2],
      index2 = _params2[3];

  var a = data[index1].ri;
  var b = d.ri; //central node

  var c = data[index2].ri;

  var ba = _Vector["default"].sub(a, b);

  var bc = _Vector["default"].sub(c, b);

  var cb = _Vector["default"].scale(-1, bc);

  var abc = _Vector["default"].angle(ba, bc);

  var pa = _Vector["default"].normalise(_Vector["default"].cross(ba, _Vector["default"].cross(ba, bc)));

  var pc = _Vector["default"].normalise(_Vector["default"].cross(cb, _Vector["default"].cross(ba, bc)));

  var faFactor = -1 * k * (abc - eqAngle) / _Vector["default"].norm(ba);

  faFactor = isNaN(faFactor) ? 0 : faFactor;

  var fa = _Vector["default"].scale(faFactor, pa);

  var fcFactor = -1 * k * (abc - eqAngle) / _Vector["default"].norm(bc);

  fcFactor = isNaN(fcFactor) ? 0 : fcFactor;

  var fc = _Vector["default"].scale(fcFactor, pc);

  var fb = _Vector["default"].scale(-1, _Vector["default"].add(fa, fc));

  return [[index1, fa], [d.id, fb], [index2, fc]];
};

exports.valenceAngle = valenceAngle;

var lennardJones = function lennardJones(d, data, params) {
  var _params3 = _slicedToArray(params, 3),
      epsilon = _params3[0],
      sigma = _params3[1],
      neighbourIndex = _params3[2];

  var a = d;
  var b = data[neighbourIndex];

  var ba = _Vector["default"].sub(a.ri, b.ri);

  var r = _Vector["default"].norm(ba);

  var u = _Vector["default"].normalise(ba);

  var faMagnitude = 24 * epsilon / r * (2 * Math.pow(sigma / r, 12) - Math.pow(sigma / r, 6));

  var fa = _Vector["default"].scale(faMagnitude, u);

  var fb = _Vector["default"].scale(-1, fa);

  return [[a.id, fa], [b.id, fb]];
};

exports.lennardJones = lennardJones;
var forceMap = {
  "testForce": testForce,
  "spring": spring,
  "valenceAngle": valenceAngle,
  "lennardJones": lennardJones
};
exports.forceMap = forceMap;

var initValence = function initValence(lattice) {
  var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  /*
  Performs the necessary initial setup for the Physics.Forcemap.valenceAngle method
  */
  lattice.data.forEach(function (d1) {
    d1.forces.forEach(function (f1) {
      if (f1.name == "spring") {
        var index1 = f1.params[2];
        var d2 = lattice.data[index1];
        d1.forces.forEach(function (f2) {
          var index2 = f2.params[2];

          if (f2.name == "spring" && index2 != index1) {
            var d3 = lattice.data[index2]; // calculate their equilibrium angles

            var vec1 = _Vector["default"].sub(d3.ri, d1.ri);

            var vec2 = _Vector["default"].sub(d2.ri, d1.ri);

            var eqAngle = _Vector["default"].angle(vec1, vec2);

            d1.forces.push({
              name: "valenceAngle",
              params: [k, eqAngle, index1, index2]
            });
          }
        });
      }
    });
  });
};

exports.initValence = initValence;
var _default = forceMap;
exports["default"] = _default;