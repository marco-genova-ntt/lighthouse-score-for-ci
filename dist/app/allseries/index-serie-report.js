"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndex = createIndex;
exports.mapAllSeries = mapAllSeries;
exports.transformEntry = transformEntry;
exports.byDate = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _ramda = _interopRequireDefault(require("ramda"));

var utility = _interopRequireWildcard(require("../utility"));

var _awsS3Manager = require("../aws-s3-manager");

var _serieReport = require("./serie-report");

var dbSeries = _interopRequireWildcard(require("./db-series"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create Index Pages. The pages is saved in a file system and, optianelly, loaded on AWS S3
 * 
 * @param {String} fileName absolute file name
 * @param {Object} allSeries all performance series 
 */
function createIndex(fileName, allSeries) {
  if (allSeries) {
    const allAnalysisRun = mapAllSeries(allSeries);

    const content = _fs.default.readFileSync(utility.string('SERIES_TEMAPLTE_INDEX_FILE', './templates/series/index.txt'), 'utf-8');

    const result = utility.replaceAll(content.toString().replace('${data_seeds}', JSON.stringify(allAnalysisRun)), '${date}', utility.nowUTC());

    _fs.default.writeFile(fileName, result, function (error) {
      if (error) throw error;

      if (utility.bool('SERIES_ENABLE_TREND_REPORT_ON_AWS')) {
        const bucketName = utility.string('AWS_BUCKET_NAME');
        (0, _awsS3Manager.uploadFile)(bucketName, 'index.html', fileName);
      }
    });
  }
}
/**
 * Transform all entries for a key in one array of transformed entries
 * 
 * @param {Object} allSeries 
 */


function mapAllSeries(allSeries) {
  const serieKeys = dbSeries.getSerieKeys(allSeries);
  let allAnalysisRuns = [];

  if (serieKeys && _ramda.default.length(serieKeys) > 0) {
    for (let i = 0; i < serieKeys.length; i++) {
      let series = dbSeries.getSeries(allSeries, serieKeys[i]);
      allAnalysisRuns = [...allAnalysisRuns, ..._ramda.default.map(transformEntry, series)];
    }
  }

  return _ramda.default.sort(byDate, allAnalysisRuns);
}
/**
 * Transform an performances entry in a entry for the template 
 * 
 * @param {Object} performances oerformances object
 */


function transformEntry(performances) {
  const template = utility.string('SERIES_AWS_S3_TEMPLATE_RESOURCE', '');
  return {
    env: performances.environment,
    text: `Analysis Run ${performances.processID} on [${performances.date}]`,
    trend: template.replace('{hashcode}', performances.key),
    report: template.replace('{hashcode}', performances.processID),
    refEnv: performances.url,
    values: (0, _serieReport.remapPerformances)(performances),
    date: performances.date
  };
}
/**
 * Comparator by _date_ prop
 */


const byDate = _ramda.default.comparator((a, b) => a.date > b.date);

exports.byDate = byDate;