"use strict";

var _lighthouseJob = require("./lighthouse-job");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _slackEmitter = require("./slack-emitter");

var _seriesManager = require("./allseries/series-manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_fs.default.readFile(_path.default.join(process.cwd(), 'pages.json'), (err, data) => {
  if (err) throw err;
  const customManagers = [_slackEmitter.dispatchMessageManager, _seriesManager.dispatchSeriesManager];
  (0, _lighthouseJob.analyze)(JSON.parse(data), customManagers);
});