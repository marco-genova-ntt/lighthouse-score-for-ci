"use strict";

var _lighthouseJob = require("./lighthouse-job");

var utility = _interopRequireWildcard(require("./utility"));

var _slackEmitter = require("./slack-emitter");

var _seriesManager = require("./allseries/series-manager");

var _awsS3Manager = require("./aws-s3-manager");

var _PagesProvider = _interopRequireDefault(require("./PagesProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function startAnalisys(pages) {
  const customManagers = [_slackEmitter.dispatchMessageManager, _seriesManager.dispatchSeriesManager]; //XXX Imporve the design of acquiring database, adding a clear lifecycle 

  if (utility.bool('SERIES_SERVICE_DATABASE_FILE_ON_AWS')) {
    (async () => {
      const bucketName = utility.string('AWS_BUCKET_NAME');
      const dbPath = utility.string('SERIES_SERVICE_DATABASE_FILE', './tmp/database.json');
      const dbName = utility.extractFileName(dbPath);
      let existence = await (0, _awsS3Manager.checkExistence)(bucketName, dbName);

      if (existence) {
        (0, _awsS3Manager.downloadFile)(bucketName, dbName, dbPath, () => {
          (0, _lighthouseJob.analyze)(pages, customManagers);
        });
      } else {
        (0, _lighthouseJob.analyze)(pages, customManagers);
      }
    })();
  } else {
    (0, _lighthouseJob.analyze)(pages, customManagers);
  }
} //docker run -e "LIGHTHOUSE_CI_ENV=qa" lighthouse-slack-ci


const pagesProvider = new _PagesProvider.default();
const context = utility.string('LIGHTHOUSE_CI_ENV', 'prod');
console.info('LightHouse CI - Environement [', context, ']');
pagesProvider.loadPages();
pagesProvider.worksOnPages(context, startAnalisys);