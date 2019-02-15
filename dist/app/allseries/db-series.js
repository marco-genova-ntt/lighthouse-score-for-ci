"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSeries = initSeries;
exports.addValueToSeries = addValueToSeries;
exports.getSeries = getSeries;

var _ramda = _interopRequireDefault(require("ramda"));

var utility = _interopRequireWildcard(require("../utility"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets a new Series Storage initialized.
 * 
 * @param {*} objectRef default object
 */
function initSeries(objectRef = null) {
  return objectRef ? [objectRef] : [];
}
/**
 * Adds object to series by key
 * 
 * @param {Array} allSeries all series
 * @param {String} key key f the series
 * @param {Array} objectToAdd object to add
 */


function addValueToSeries(allSeries, key, objectToAdd) {
  if (objectToAdd && allSeries) {
    const series = getSeries(allSeries, key);

    if (series) {
      if (_ramda.default.length(series) >= utility.number('SERIES_DIMENSION', 45)) {
        series.splice(0, _ramda.default.length(series) - utility.number('SERIES_DIMENSION', 45) + 1);
      }

      allSeries[key] = [...series, objectToAdd];
    } else {
      allSeries[key] = initSeries(objectToAdd);
    }
  }
}
/**
 * Get a series for a key
 * 
 * @param {*} allSeries object of all series
 * @param {*} key key
 */


function getSeries(allSeries, key) {
  return utility.extractValue(allSeries, key);
}