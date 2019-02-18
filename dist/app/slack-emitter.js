"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchMessageManager = dispatchMessageManager;

var lfs = _interopRequireWildcard(require("lighthouse-score-for-slack"));

var utility = _interopRequireWildcard(require("./utility"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function dispatchMessageManager(processID = '000000', page = '', results) {
  if (results) {
    const performances = lfs.extractPerformanceValues(results);
    const author = utility.string('AUTHOR', 'Lighthouse Score For Slack');
    const thumbUrl = utility.string('THUMBURL', 'https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png');
    let template = utility.string('AWS_S3_TEMPLATE_RESOURCE');
    const linkToReport = utility.replace(template, 'processID', processID);
    let message;

    if (utility.bool('SERIES_SERVICE_DATABASE_FILE_ON_AWS')) {
      //=https://s3.eu-north-1.amazonaws.com/test.lighthouse/{hashcode}.html
      let templateSeries = utility.string('SERIES_AWS_S3_TEMPLATE_RESOURCE');
      const linkToReportSeries = utility.replace(templateSeries, 'hashcode', utility.createHash(performances.url));
      message = `Page: ${performances.url} and Report series: ${linkToReportSeries}`;
    } else {
      message = `Page: ${performances.url}`;
    }

    lfs.dispatchMessage(processID, author, performances.url, linkToReport, message, thumbUrl, performances.performance, performances.accessibility, performances.bestpractices, performances.seo, performances.pwa);
  }
}