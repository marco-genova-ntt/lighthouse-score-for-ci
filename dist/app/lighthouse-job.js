"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyze = analyze;

var _analyzer = require("./analyzer");

var R = _interopRequireWildcard(require("ramda"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Starts an analizer job on pages
 * 
 * @param {Array} pages web pages to analyze 
 * @param {Array} customManagers custom managers for result management
 */
function analyze(pages, customManagers) {
  _dotenv.default.config({
    path: _path.default.join(process.cwd(), '.env')
  });

  if (!R.isNil(pages) && R.length(pages) > 0) {
    (0, _analyzer.launchChrome)(pages, customManagers);
  }
}