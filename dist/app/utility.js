"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = string;
exports.number = number;
exports.bool = bool;
exports.replace = replace;
exports.randomInt = randomInt;
exports.getAbsolutePath = getAbsolutePath;
exports.concatAll = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _process = _interopRequireDefault(require("process"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Gets a string environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {String} defaultVal - The default value to use.
 *
 * @return {String} The value.
 */
function string(name, defaultVal) {
  return _process.default.env[name] || defaultVal;
}
/**
 * Gets a number environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {number} defaultVal - The default value to use.
 *
 * @return {number} The value.
 */


function number(name, defaultVal) {
  return _process.default.env[name] ? parseInt(_process.default.env[name], 10) : defaultVal;
}
/**
 * Gets a bool environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {bool} defaultVal - The default value to use.
 *
 * @return {bool} The value.
 */


function bool(name, defaultVal) {
  return _process.default.env[name] ? _process.default.env[name] === 'true' || _process.default.env[name] === '1' : defaultVal;
}
/**
 * Replaces a part of phrase with a new value. 
 * Placeholder formart {placeholder}
 * 
 * @param {string} phrase 
 * @param {string} toReplace 
 * @param {string} withValue 
 */


function replace(phrase, toReplace, withValue) {
  return R.replace(`{${toReplace}}`, withValue, phrase);
}
/**
 * Concat all string of fields {string}
 */


const concatAll = R.unapply(R.reduce(R.concat, ''));
/**
 * Generates random integer 
 * 
 * @param {*} low low value
 * @param {*} high high value
 */

exports.concatAll = concatAll;

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
/**
 * Gets absolute path adding an optional relative path
 * 
 * @param {*} relativePath optinal relative path to add
 */


function getAbsolutePath(relativePath) {
  return _path.default.join(_process.default.cwd(), relativePath ? relativePath : '');
}