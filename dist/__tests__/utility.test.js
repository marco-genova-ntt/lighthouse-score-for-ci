"use strict";

var utility = _interopRequireWildcard(require("../app/utility"));

var _StoreManager = _interopRequireDefault(require("../app/StoreManager"));

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
test('create a new json file', () => {
  const json = {
    "property": "value"
  };
  utility.writeJSONToFile('./tmp/file.json', json);
  const readJson = utility.getJSONFromFile('./tmp/file.json');
  expect(readJson).toEqual(json);
});
test('read not existent file', () => {
  const readJson = utility.getJSONFromFile('./tmp/file-not-exist.json');
  expect(readJson).toBeUndefined();
});
test('not empty result on createhash', () => {
  let valued = utility.createHash('value');
  expect(valued).not.toBeUndefined();
  expect(valued).not.toBeNull();
});
test('not empty result on nowUTC', () => {
  let valued = utility.nowUTC();
  expect(valued).not.toBeUndefined();
  expect(valued).not.toBeNull();
  expect(valued.length).toBe(19);
});
test('replace All occurrencies', () => {
  let message = 'uno due tre quattro due';
  let result = utility.replaceAll(message, 'due', 'tre');
  expect(result).not.toBeUndefined();
  expect(result).not.toBeNull();
  expect(result).toEqual('uno tre tre quattro tre');
});
test('clone prop', () => {
  let refObjet = {};
  expect(utility.getClonedProp("not-exist", refObjet)).toBeUndefined();
  refObjet = {
    "prop1": "value1",
    "prop2": "value2"
  };
  expect(utility.getClonedProp("prop2", refObjet)).not.toBeUndefined();
  expect(utility.getClonedProp("prop2", refObjet)).toEqual("value2");
});
test('fileName environment based', () => {
  _process.default.env['LIGHTHOUSE_CI_ENV'] = 'qa';
  expect(utility.fileNameEnvBased('check')).toEqual('qa-check');
  expect(utility.fileNameEnvBased()).toEqual('qa-');
});
test('manageGenericError', () => {
  utility.manageGenericError();
});
test('Generic counter', () => {
  const testStore = new _StoreManager.default(utility.getAbsolutePath('dist/__tests__/tmp/.test_storage_utility.json'));
  const TEST_ID = 'TEST_ID';
  expect(utility.getCounter()).toBe(0);
  expect(utility.getCounter(TEST_ID, testStore)).toBe(0);
  expect(utility.improveCounter(TEST_ID, testStore)).toBe(1);
  expect(utility.improveCounter('FAKE', testStore)).toBe(1);
  expect(utility.improveCounter(TEST_ID, testStore)).toBe(2);
  expect(utility.improveCounter(TEST_ID, testStore)).toBe(3);
  expect(utility.getCounter(TEST_ID, testStore)).toBe(3);
  expect(utility.resetCounter(TEST_ID, testStore)).toBe(0);
  expect(utility.getCounter(TEST_ID, testStore)).toBe(0);
});