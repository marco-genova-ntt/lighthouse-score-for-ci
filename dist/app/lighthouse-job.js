"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyze = analyze;

var _analyzer = require("./analyzer");

var _ramda = _interopRequireDefault(require("ramda"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Starts an analizer job on pages
 * 
 * @param {Array} pages web pages to analyze 
 * @param {Array} customManagers custom managers for result management
 */
function analyze(pages, customManagers) {
  if (!_ramda.default.isNil(pages) && _ramda.default.length(pages) > 0) {
    (0, _analyzer.launchChrome)(pages, customManagers);
  }
}