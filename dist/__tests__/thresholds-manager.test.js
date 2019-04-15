"use strict";

var _thresholdsManager = require("../app/thresholds/thresholds-manager");

var _StoreManager = _interopRequireDefault(require("../app/StoreManager"));

var utility = _interopRequireWildcard(require("../app/utility"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('thresholds evaluation', () => {
  /*utility.store = new StoreManager(utility.getAbsolutePath('dist/__tests__/tmp/.test_storage_thresholds.json'));
    let performances = {
      date: '2019-02-14',
      performance: 1,
      accessibility: 2,
      bestpractices: 3,
      seo:4,
      pwa:5
  };
    let lighthouserc = {
      "thresholds": {
        "performance": 90.25,
        "pwa": 90.25,
        "bestpractices": 90.25,
        "seo": 90.25,
        "accessibility": 90.25
      }
  }
  
  evaluatesThresholds(performances, lighthouserc['thresholds']);
  expect(utility.getCounter(THRESHOLDS_COUNTER_ID)).toBe(5);
  utility.resetCounter(THRESHOLDS_COUNTER_ID);
    
  performances = {
      date: '2019-02-14',
      performance: 100,
      accessibility: 100,
      bestpractices: 100,
      seo:4,
      pwa:5
  };
    evaluatesThresholds(performances, lighthouserc['thresholds']);
  expect(utility.getCounter(THRESHOLDS_COUNTER_ID)).toBe(2);
  utility.resetCounter(THRESHOLDS_COUNTER_ID);
  
  forceErrorOnExit(100);*/
});