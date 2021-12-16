"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _UserInterface = _interopRequireDefault(require("../modules/graphics/UserInterface.js"));

var _Renderer = _interopRequireDefault(require("../modules/graphics/Renderer.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Graphics = {
  userInterface: _UserInterface["default"],
  renderer: _Renderer["default"]
};
var _default = Graphics;
exports["default"] = _default;