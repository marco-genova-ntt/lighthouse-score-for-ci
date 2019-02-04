"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyze = analyze;

var _analyzer = require("./analyzer");

var R = _interopRequireWildcard(require("ramda"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Start an analizer job 
 * 
 * @param {*} pages web pages to analyze 
 */
function analyze(pages) {
  if (!R.isNil(pages) && R.length(pages) > 0) {
    (0, _analyzer.launchChrome)(pages);
  }
}