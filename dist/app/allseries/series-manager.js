"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchSeriesManager = dispatchSeriesManager;
exports.populatesPerformancesWithDate = populatesPerformancesWithDate;
exports.populatesPerformancesWithKey = populatesPerformancesWithKey;

var _SeriesService = _interopRequireDefault(require("./services/SeriesService"));

var dbSeries = _interopRequireWildcard(require("./db-series"));

var utility = _interopRequireWildcard(require("../utility"));

var lfs = _interopRequireWildcard(require("lighthouse-score-for-slack"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const seriesService = new _SeriesService.default();
/**
 * Manges series:
 * 
 * <ol>
 *  <li>load from source all series</li>
 *  <li>chek lighthouse performances</li>
 *  <li>enforce performances</li>
 *  <li>add new serie</li>
 *  <li>save all series</li>
 * </ol>
 * @param {*} processID process analysis identifier 
 * @param {*} page references page
 * @param {*} results lighthouse complete results set
 */

function dispatchSeriesManager(processID = '000000', page = '', results) {
  if (results) {
    //load database 
    let allSeries = seriesService.loadDatabase(); //extract performances

    let performances = lfs.extractPerformanceValues(results);
    performances = populatesPerformancesWithDate(performances);
    performances = populatesPerformancesWithKey(performances, processID); //add to performances

    dbSeries.addValueToSeries(allSeries, performances.key, performances);
    seriesService.saveDatabase(allSeries);
  }
}
/**
 * Populates performanecs object with <i>date</i>:<i>now time</i>. The time is in format <i>YYYY-MM-DD hh:mm:ss</i>
 * 
 * @param {*} performances lighthouse performances set
 */


function populatesPerformancesWithDate(performances = {}) {
  return { ...performances,
    date: utility.nowUTC()
  };
}
/**
 * Populates performanecs object with:
 * 
 * <ol>
 *  <li><i>key</i>:<i>hash code of url</i></li> 
 *  <li><i>processID</i>:<i>processID</i></li>
 * </ol>
 * 
 * @param {*} performances lighthouse performances set
 */


function populatesPerformancesWithKey(performances, processID = '000000') {
  return { ...performances,
    key: utility.createHash(performances.url),
    processID: processID
  };
}