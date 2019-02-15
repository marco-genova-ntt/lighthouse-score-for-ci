"use strict";

var _serieReport = require("../app/allseries/serie-report");

var _ramda = _interopRequireDefault(require("ramda"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('test base functionality of populatesPerformancesWithDate', () => {
  let performances = {
    date: '2019-02-14',
    performance: 1,
    accessibility: 2,
    bestpractices: 3,
    seo: 4,
    pwa: 5
  };

  const data = _ramda.default.map(_serieReport.remapPerformances, [performances]);

  expect(data).not.toBeUndefined();
  expect(data).not.toBeNull();
  expect(data).toEqual([['2019-02-14', 1, 2, 3, 4, 5]]);
});