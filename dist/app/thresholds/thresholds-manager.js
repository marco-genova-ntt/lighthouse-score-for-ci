"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchThresholdsEvaluation = dispatchThresholdsEvaluation;
exports.evaluatesThresholds = evaluatesThresholds;
exports.checkThreshold = checkThreshold;
exports.forceErrorOnExit = forceErrorOnExit;
exports.PERFORMANCES_IDS = exports.THRESHOLDS_COUNTER_ID = exports.EXIT_CODE_THRESHOLDS_NOT_REACHED = void 0;

var lfs = _interopRequireWildcard(require("lighthouse-score-for-slack"));

var _utility = require("../utility");

var _process = _interopRequireDefault(require("process"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Error code for exit on thresholds violation
 */
const EXIT_CODE_THRESHOLDS_NOT_REACHED = 32;
/**
 * Counter Identifier
 */

exports.EXIT_CODE_THRESHOLDS_NOT_REACHED = EXIT_CODE_THRESHOLDS_NOT_REACHED;
const THRESHOLDS_COUNTER_ID = 'THRESHOLDS_COUNTER_ID';
/**
 * KPI identifiers used
 */

exports.THRESHOLDS_COUNTER_ID = THRESHOLDS_COUNTER_ID;
const PERFORMANCES_IDS = ['performance', 'accessibility', 'bestpractices', 'seo', 'pwa'];
/**
 * 
 * @param {String} processID 
 * @param {String} page 
 * @param {Object} results 
 */

exports.PERFORMANCES_IDS = PERFORMANCES_IDS;

function dispatchThresholdsEvaluation(processID = '000000', page = '', results) {
  if (results) {
    const performances = lfs.extractPerformanceValues(results);
    const lighthouseThresholds = (0, _utility.getJSONFromFile)((0, _utility.getAbsolutePath)('lighthouse-thresholds.json'));
    console.log(JSON.stringify(lighthouseThresholds));
    evaluatesThresholds(performances, lighthouseThresholds['thresholds']);
  }
}
/**
 * Evaluates thresholds on perfomances
 * 
 * @param {Object} performances KPI set 
 * @param {Object} thresholds thresolds set 
 */


function evaluatesThresholds(performances, thresholds) {
  if (performances) {
    PERFORMANCES_IDS.forEach(id => {
      if (!checkThreshold(id, performances, thresholds)) {
        (0, _utility.improveCounter)(THRESHOLDS_COUNTER_ID);
      }
    });
  }
}
/**
 * Checks single value 
 * 
 * @param {String} key KPI id
 * @param {Object} performances KPI set 
 * @param {Object} thresholds thresolds set
 */


function checkThreshold(key, performances, thresholds) {
  if (key && performances[key] && thresholds[key]) {
    const value = parseFloat(performances[key]);
    const threshold = parseFloat(thresholds[key]);
    console.debug("value: ", value, " vs threshold: ", threshold);
    return value >= threshold;
  }

  return true;
}
/**
 * Forces error on exit if thresholds are violated
 * 
 *  @param {Object} threshold thresolds set
 */


function forceErrorOnExit(threshold = 0) {
  if ((0, _utility.getCounter)(THRESHOLDS_COUNTER_ID) > threshold) {
    (0, _utility.resetCounter)(THRESHOLDS_COUNTER_ID);
    console.error('Violated constraints, check reports for details');

    _process.default.exit(EXIT_CODE_THRESHOLDS_NOT_REACHED);
  }
}