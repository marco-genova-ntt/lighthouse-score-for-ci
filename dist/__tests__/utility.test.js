"use strict";

var utility = _interopRequireWildcard(require("../app/utility"));

var _process = _interopRequireDefault(require("process"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

test('check default string', () => {
  expect(utility.string('NOT_DEF', 'def')).toBe('def');
});
test('check default number', () => {
  expect(utility.number('NOT_DEF', 2)).toBe(2);
});
test('check default bool', () => {
  expect(utility.bool('NOT_DEF', false)).toBe(false);
});
test('check base replace ', () => {
  expect(utility.replace('basic string {placeholder}', 'placeholder', 'replaced')).toBe('basic string replaced');
});
test('check no placeholder replace ', () => {
  expect(utility.replace('basic string noplaceholder', 'noplaceholder', 'replaced')).toBe('basic string noplaceholder');
});
test('check base concatall ', () => {
  expect(utility.concatAll('000', 'AAA')).toBe('000AAA');
});
test('check concatall empty string', () => {
  expect(utility.concatAll('')).toBe('');
});
test('check random int', () => {
  let value = utility.randomInt(1, 10);
  expect(value >= 0 && value <= 10).toBe(true);
});
test('check relative path empty', () => {
  expect(utility.getAbsolutePath()).toEqual(_process.default.cwd());
});
test('check the directory creation', () => {
  const directory = './tmp/middle/last';
  utility.mkDirByPathSync(directory);

  _fs.default.rmdirSync('./tmp/middle/last');

  _fs.default.rmdirSync('./tmp/middle');
});