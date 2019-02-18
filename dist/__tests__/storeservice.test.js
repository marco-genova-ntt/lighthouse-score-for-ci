"use strict";

var _SeriesStoreManager = _interopRequireDefault(require("./../app/allseries/SeriesStoreManager"));

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('check constructuor', () => {
  _process.default.env['SERIES_SERVICE_DATABASE_FILE'] = './tmp/database.json';
  const storeService = new _SeriesStoreManager.default();
  expect(storeService.validConfiguration).toEqual({
    "path": "./tmp/database.json"
  });
});
test('check base Configuration', () => {
  const storeService = new _SeriesStoreManager.default({
    path: 'my-path'
  });
  expect(storeService.validConfiguration.path).toEqual('my-path');
});
test('check save and load database', () => {
  _process.default.env['SERIES_DIMENSION'] = 4;
  const storeService = new _SeriesStoreManager.default({
    path: './tmp/database.json'
  });
  const dataBase = {
    property: "value"
  };
  expect(storeService.saveDatabase(dataBase)).not.toBeUndefined();
  const readDatabase = storeService.loadDatabase();
  expect(readDatabase).toEqual(dataBase);
});