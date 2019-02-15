"use strict";

var _AWSSeriesStoreManager = _interopRequireDefault(require("../app/allseries/AWSSeriesStoreManager"));

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('check constructuor', () => {
  _process.default.env['SERIES_SERVICE_DATABASE_FILE'] = './tmp/database.json';
  const storeService = new _AWSSeriesStoreManager.default();
  expect(storeService.validConfiguration).toEqual({
    "path": "./tmp/database.json",
    "dbName": "database.json"
  });
  expect(storeService.validConfiguration.dbName).toEqual('database.json');
});