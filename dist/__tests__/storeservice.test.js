"use strict";

var _SeriesService = _interopRequireDefault(require("./../app/allseries/services/SeriesService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('check constructuor', () => {
  const storeService = new _SeriesService.default(undefined);
  expect(storeService.validConfiguration).toEqual({});
});
test('check base Configuration', () => {
  const storeService = new _SeriesService.default({
    path: 'my-path'
  });
  expect(storeService.validConfiguration.path).toEqual('my-path');
});
test('check save and load database', () => {
  const storeService = new _SeriesService.default({
    path: './tmp/database.json'
  });
  const dataBase = {
    property: "value"
  };
  expect(storeService.saveDatabase(dataBase)).not.toBeUndefined();
  const readDatabase = storeService.loadDatabase();
  expect(readDatabase).toEqual(dataBase);
});