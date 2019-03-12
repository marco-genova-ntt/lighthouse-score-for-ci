"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _StoreManager = _interopRequireDefault(require("./StoreManager"));

var _ramda = _interopRequireDefault(require("ramda"));

var utility = _interopRequireWildcard(require("./utility"));

var _awsS3Manager = require("./aws-s3-manager");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Exposes the same functionalities of @see StoreManager but for the function
 * _setValueToStorage_ upload the file after changes. The storage is based on the local copy
 */
class AWSStoreManager extends _StoreManager.default {
  /**
   * Sets the value 
   * @param {string} key key
   * @param {*} value value
   */
  setValueToStorage(key, value) {
    this._internalStore.put(key, value);

    const bucketName = utility.string('AWS_BUCKET_NAME');
    (0, _awsS3Manager.uploadFile)(bucketName, '.local_storage.json', this._location, 'application/json');
    return _ramda.default.clone(value);
  }

}

var _default = AWSStoreManager;
exports.default = _default;