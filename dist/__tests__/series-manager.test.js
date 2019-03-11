"use strict";

var _seriesManager = require("./../app/allseries/series-manager");

var _process = _interopRequireDefault(require("process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('test base functionality of populatesPerformancesWithDate', () => {
  let performances = {};
  performances = (0, _seriesManager.populatesPerformancesWithDate)(performances);
  expect(performances).not.toBeUndefined();
  expect(performances).not.toBeNull();
  expect(performances.date).not.toBeUndefined();
  expect(performances.date.length).toBe(19);
});
test('test base functionality of populatesPerformancesWithKey', () => {
  let performances = {
    url: 'test'
  };
  performances = (0, _seriesManager.populatesPerformancesWithKey)(performances, '123456');
  expect(performances).not.toBeUndefined();
  expect(performances).not.toBeNull();
  expect(performances.key).not.toBeUndefined();
  expect(performances.processID).not.toBeUndefined();
  expect(performances.processID).toEqual('123456');
});
test('test base functionality of populatesPerformancesWithKey', () => {
  _process.default.env['LIGHTHOUSE_CI_ENV'] = 'toBeTested';
  let performances = {
    url: 'test'
  };
  performances = (0, _seriesManager.populatesPerformancesWithEnv)(performances);
  expect(performances).not.toBeUndefined();
  expect(performances).not.toBeNull();
  expect(performances.environment).not.toBeUndefined();
  expect(performances.environment).toEqual('toBeTested');
});