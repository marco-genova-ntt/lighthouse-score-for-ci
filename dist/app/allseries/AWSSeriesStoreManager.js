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

/**
 * Manage the series information on local enironment as mirror of AWS S3 
 */
class AWSSeriesStoreManager extends _SeriesStoreManager.default {
  constructor(configuration = {}) {
    super(configuration);
    this._configuration.dbName = utility.extractFileName(this._configuration.path);
  }
  /**
   * Saves all information:
   * 
   * <ol>
   *  <li>In local, then</li>
   *  <li>In AWS</li>
   * </ol>
   * 
   * @param {Any} database all series json 
   */


  saveDatabase(database) {
    super.saveDatabase(database);
    const bucketName = utility.string('AWS_BUCKET_NAME');
    (0, _awsS3Manager.uploadFile)(bucketName, this._configuration.dbName, this._configuration.path, 'application/json');
  }

}

var _default = AWSSeriesStoreManager;
exports.default = _default;