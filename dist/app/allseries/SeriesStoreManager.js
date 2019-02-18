"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ramda = _interopRequireDefault(require("ramda"));

var utility = _interopRequireWildcard(require("../utility"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Manage the series information on local enironment 
 */
class SeriesStoreManager {
  constructor(configuration = {}) {
    this._configuration = _ramda.default.clone(configuration);

    if (!this._configuration.path) {
      this._configuration.path = utility.string('SERIES_SERVICE_DATABASE_FILE', './tmp/database.json');
    }

    console.info('Series database placed here:', this._configuration.path);
  }
  /**
   * Loads an existent database, otherwise creates it
   */


  loadDatabase() {
    const internalFile = this._configuration.path;
    const database = utility.getJSONFromFile(internalFile);

    if (!database) {
      console.info('initialize empty database');
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
      console.info('write database to ', internalFile);
      utility.writeJSONToFile(internalFile, database);
    }

    return database;
  }

  get validConfiguration() {
    return { ...this._configuration
    };
  }

}

var _default = SeriesStoreManager;
exports.default = _default;