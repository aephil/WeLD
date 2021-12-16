"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verlet = exports["default"] = void 0;

var _ForceMap = _interopRequireDefault(require("./ForceMap.js"));

var _Vector = _interopRequireDefault(require("./Vector.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Verlet = function Verlet(d, data) {
  var dt = 1e-1;

  var zeroForces = function zeroForces(data) {
    data.forEach(function (d) {
      d.force = {
        x: 0,
        y: 0,
        z: 0
      };
    });
  };

  var updateForces = function updateForces(data) {
    zeroForces(data);
    data.forEach(function (d) {
      d.forces.forEach(function (_ref) {
        var name = _ref.name,
            params = _ref.params,
            color = _ref.color;
        var actionFunction = _ForceMap["default"][name];
        var actions = actionFunction(d, data, params);
        actions.forEach(function (action, i) {
          var _action = _slicedToArray(action, 2),
              index = _action[0],
              force = _action[1];

          var node = data[index];
          node.force = _Vector["default"].add(node.force, force);
        });
      });
    });
  };

  this.integrationStep = function (data) {
    // leapfrog step
    updateForces(data);
    velocityVerlet1(data);
    updateForces(data);
    velocityVerlet2(data);
  }; // calculate total force acting on the node


  var velocityVerlet1 = function velocityVerlet1(data) {
    // first part of velocity verlet algorithm
    data.forEach(function (d) {
      d.vi = _Vector["default"].add(d.vi, _Vector["default"].scale(0.5 * dt, d.force));
      d.ri = _Vector["default"].add(d.ri, _Vector["default"].scale(dt, d.vi));
    });
  };

  var velocityVerlet2 = function velocityVerlet2(data) {
    // second part of velocity verlet algorithm
    data.forEach(function (d) {
      d.vi = _Vector["default"].add(d.vi, _Vector["default"].scale(0.5 * dt, d.force));
    });
  };
};

var verlet = new Verlet();
exports.verlet = verlet;
var _default = verlet;
exports["default"] = _default;