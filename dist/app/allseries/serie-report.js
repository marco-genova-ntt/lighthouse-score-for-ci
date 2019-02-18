"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHTMLReport = createHTMLReport;
exports.remapPerformances = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _ramda = _interopRequireDefault(require("ramda"));

var utility = _interopRequireWildcard(require("../utility"));

var _awsS3Manager = require("../aws-s3-manager");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generates a file report on the disk based on the template defned by environment variale (SERIES_TEMAPLTE_TREND_FILE)
 * 
 * @param {String} fileName report file name
 * @param {Array} serie array of performance
 */
function createHTMLReport(key, fileName, serie) {
  if (serie && _ramda.default.length(serie) > 0) {
    const content = _fs.default.readFileSync(utility.string('SERIES_TEMAPLTE_TREND_FILE', './templates/series/anychart-template.txt'), 'utf-8');

    const data = _ramda.default.map(remapPerformances, serie);

    const result = utility.replaceAll(content.toString().replace('${data_seeds}', JSON.stringify(data)), '${page}', serie[0].url);

    _fs.default.writeFile(fileName, result, function (error) {
      if (error) throw error;

      if (utility.bool('SERIES_ENABLE_TREND_REPORT_ON_AWS')) {
        const bucketName = utility.string('AWS_BUCKET_NAME');
        (0, _awsS3Manager.uploadFile)(bucketName, key, fileName);
      }
    });
  }
}
/**
 * Remap a single set of performances in an array of score values, composed by:
 * 
 * <ol>
 * <li>date of execution</li>
 * <li>performance</li>
 * <li>accessibility</li>
 * <li>bestpractive</li>
 * <li>seo</li>
 * <li>pwa</li>
 * </ol>
 * 
 * @param {Object} values 
 */


const remapPerformances = values => [values.date, values.performance, values.accessibility, values.bestpractices, values.seo, values.pwa];

exports.remapPerformances = remapPerformances;