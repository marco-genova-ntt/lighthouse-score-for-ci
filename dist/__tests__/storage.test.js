"use strict";

var utility = _interopRequireWildcard(require("../app/utility"));

var _StoreManager = _interopRequireDefault(require("../app/StoreManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

test('check progressive counter', () => {
  const testStore = new _StoreManager.default(utility.getAbsolutePath('dist/__tests__/tmp/.test_storage.json'));
  expect(testStore.setValueToStorage('COUNTER', 0)).toBe(0);
  expect(utility.getProgressiveCounter(testStore)).toBe(1);
  expect(utility.getProgressiveCounter(testStore)).toBe(2);
});