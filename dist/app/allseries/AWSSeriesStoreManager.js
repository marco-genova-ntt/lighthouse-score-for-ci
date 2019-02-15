"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SeriesStoreManager = _interopRequireDefault(require("./SeriesStoreManager"));

var _awsS3Manager = require("../aws-s3-manager");

var utility = _interopRequireWildcard(require("../utility"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AWSSeriesStoreManager extends _SeriesStoreManager.default {
  constructor(configuration = {}) {
    super(configuration);
    this._configuration.dbName = utility.extractFileName(this._configuration.path);
  }

  loadDatabase() {
    const bucketName = utility.string('AWS_BUCKET_NAME');
    (0, _awsS3Manager.checkExistence)(bucketName, this._configuration.dbName).then(existence => {
      if (existence) {
        (0, _awsS3Manager.downloadFile)(bucketName, this._configuration.dbName, this._configuration.path);
      }

      return super.loadDatabase();
    }).catch(function (err) {
      console.error(err, err.stack);
    });
  }

  saveDatabase(database) {
    super.saveDatabase(database);
    const bucketName = utility.string('AWS_BUCKET_NAME');
    (0, _awsS3Manager.uploadFile)(bucketName, this._configuration.dbName, this._configuration.path, 'application/json');
  }

}

var _default = AWSSeriesStoreManager;
exports.default = _default;