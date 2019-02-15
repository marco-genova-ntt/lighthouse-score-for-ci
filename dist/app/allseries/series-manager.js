"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchSeriesManager = dispatchSeriesManager;
exports.populatesPerformancesWithDate = populatesPerformancesWithDate;
exports.populatesPerformancesWithKey = populatesPerformancesWithKey;

var _SeriesStoreManager = _interopRequireDefault(require("./SeriesStoreManager"));

var _AWSSeriesStoreManager = _interopRequireDefault(require("./AWSSeriesStoreManager"));

var dbSeries = _interopRequireWildcard(require("./db-series"));

var utility = _interopRequireWildcard(require("../utility"));

var lfs = _interopRequireWildcard(require("lighthouse-score-for-slack"));

var _serieReport = require("./serie-report");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let seriesStoreManager; ///XXX implement factory mode

if (utility.bool('SERIES_SERVICE_DATABASE_FILE_ON_AWS')) {
  seriesStoreManager = new _AWSSeriesStoreManager.default();
  console.info('trend report mode: AWS');
} else {
  seriesStoreManager = new _SeriesStoreManager.default();
  console.info('trend report mode: LOCAL');
}
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
 * 
 * @param {*} processID process analysis identifier 
 * @param {*} page references page
 * @param {*} results lighthouse complete results set
 */


function dispatchSeriesManager(processID = '000000', page = '', results) {
  if (results) {
    //load database 
    let allSeries = seriesStoreManager.loadDatabase();
    console.info('all series from database: ', allSeries); //extract performances

    let performances = lfs.extractPerformanceValues(results);
    performances = populatesPerformancesWithDate(performances);
    performances = populatesPerformancesWithKey(performances, processID); //add to performances

    dbSeries.addValueToSeries(allSeries, performances.key, performances);
    console.info('all series after update: ', allSeries);
    seriesStoreManager.saveDatabase(allSeries);

    if (utility.bool('SERIES_ENABLE_TREND_REPORT')) {
      (0, _serieReport.createHTMLReport)(`${performances.key}.html`, utility.getAbsolutePath(`tmp/${performances.key}.html`), dbSeries.getSeries(allSeries, performances.key));
    }
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