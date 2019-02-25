"use strict";

var _ramda = _interopRequireDefault(require("ramda"));

var _PagesProvider = _interopRequireDefault(require("./../app/PagesProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('check default constructor', () => {
  let pp = new _PagesProvider.default();
  expect(pp).not.toBeUndefined();
  expect(pp.pages).toEqual({});
  expect(pp._baseFile).toEqual('pages.json');
});
test('check a complete load process', () => {
  let pp = new _PagesProvider.default({
    baseFile: "./tmp/test_pages.json"
  });
  expect(pp).not.toBeUndefined();
  expect(pp._baseFile).toEqual('./tmp/test_pages.json');
  expect(pp.pages).toEqual({});
  pp.loadPages();
  expect(pp.pages).not.toBeUndefined();
  pp.worksOnPages('test2', pages => {
    expect(_ramda.default.length(pages)).toBe(2);
  });
});