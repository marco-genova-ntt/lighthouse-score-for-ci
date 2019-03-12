"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeStorage = _interopRequireDefault(require("node-storage"));

var _ramda = _interopRequireDefault(require("ramda"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Manges a simple storage to save data among several runs 
 * Based on node-storage @see https://www.npmjs.com/package/node-storage
 */
class StoreManager {
  /**
   * Default constructor 
   * 
   * @param {*} location local path of the database file
   */
  constructor(location) {
    this._location = location;
    this._internalStore = new _nodeStorage.default(location);
  }
  /**
   * Gets value associated to key, if value is empty the default value will be retured and setted on storage
   * 
   * @param {string} key key of the value
   * @param {*} defValue default value
   */


  getValueFromStorage(key, defValue) {
    const value = this._internalStore.get(key);

    return !value ? this.setValueToStorage(key, defValue) : value;
  }
  /**
   * Sets the value 
   * @param {string} key key
   * @param {*} value value
   */


  setValueToStorage(key, value) {
    this._internalStore.put(key, value);

    return _ramda.default.clone(value);
  }

}

var _default = StoreManager;
exports.default = _default;