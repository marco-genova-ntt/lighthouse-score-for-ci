"use strict";

var _lighthouseJob = require("./lighthouse-job");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

var _slackEmitter = require("./slack-emitter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config({
  path: _path.default.join(process.cwd(), '.env')
});

const customManagers = [_slackEmitter.dispatchMessageManager]; //analyze(['https://www.leroymerlin.it','https://www.leroymerlin.it/prodotti/specchi-bagno-CAT35-c'], customManagers);

(0, _lighthouseJob.analyze)(['https://www.leroymerlin.it'], customManagers);