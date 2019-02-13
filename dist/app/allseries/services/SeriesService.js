"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var R = _interopRequireWildcard(require("ramda"));

var utility = _interopRequireWildcard(require("../../utility"));

var _assert = require("assert");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class SeriesService {
  /**
   * 
   * @param {*} configuration 
   */
  constructor(configuration) {
    if (R.isEmpty(configuration)) {
      this._configuration = {};
    } else {
      this._configuration = R.clone(configuration);
    }
  }
  /**
   * Loads an existent database, otherwise creates it
   */


  loadDatabase() {
    const internalFile = this._configuration.path;
    const database = utility.getJSONFromFile(internalFile);

    if (!database) {
      utility.writeJSONToFile(internalFile, {});
      return {};
    }

    return database;
  }
  /**
   * Saves the database on file system.
   * 
   *  @param {Any} database 
   */


  saveDatabase(database) {
    if (database) {
      const internalFile = this._configuration.path;
      utility.writeJSONToFile(internalFile, database);
    }

    return database;
  }

  get validConfiguration() {
    return { ...this._configuration
    };
  }

}

var _default = SeriesService;
exports.default = _default;