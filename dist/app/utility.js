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
exports.getProgressiveCounter = getProgressiveCounter;
exports.mkDirByPathSync = mkDirByPathSync;
exports.extractValue = extractValue;
exports.getJSONFromFile = getJSONFromFile;
exports.writeJSONToFile = writeJSONToFile;
exports.lookup = exports.concatAll = void 0;

var R = _interopRequireWildcard(require("ramda"));

var _process = _interopRequireDefault(require("process"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _storage = _interopRequireDefault(require("./storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const store = new _storage.default(getAbsolutePath('.local_storage.json'));
/**
 * Gets a string environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {String} defaultVal - The default value to use.
 *
 * @return {String} The value.
 */

function string(name, defaultVal = '') {
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


function number(name, defaultVal = 0) {
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


function bool(name, defaultVal = false) {
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


function replace(phrase = '', toReplace = '', withValue = '') {
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

function randomInt(low = 0, high = 100) {
  return Math.floor(Math.random() * (high - low) + low);
}
/**
 * Gets absolute path adding an optional relative path
 * 
 * @param {*} relativePath optinal relative path to add
 */


function getAbsolutePath(relativePath = '') {
  return _path.default.join(_process.default.cwd(), relativePath);
}
/**
 * Gets a counter of a progressive values among runs.
 * Parameter is optional an internal store is used
 * 
 * @param {StoreManager} specificStore optional store
 */


function getProgressiveCounter(specificStore) {
  const storeToUse = specificStore ? specificStore : store;
  return storeToUse.setValueToStorage('COUNTER', R.inc(storeToUse.getValueFromStorage('COUNTER', 0)));
}
/**
 * Creates a not existent directory in recursive way. (Support Node <= 10.11.0)
 * 
 * @param {*} targetDir the child file or directory
 * @param {*} params
 */


function mkDirByPathSync(targetDir, {
  isRelativeToScript = false
} = {}) {
  const sep = _path.default.sep;
  const initDir = _path.default.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';
  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = _path.default.resolve(baseDir, parentDir, childDir);

    try {
      _fs.default.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir;
      } // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.


      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;

      if (!caughtErr || caughtErr && curDir === _path.default.resolve(targetDir)) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}
/**
 * Gets value for a property of an object. Default value is an empty Array
 * 
 * @param {*} refObject object reference
 * @param {*} idProperty property name
 */


function extractValue(refObject, idProperty) {
  const hasProperty = R.has(idProperty);

  if (refObject && hasProperty(refObject)) {
    return R.clone(refObject[idProperty]);
  }

  return undefined;
}
/**
 * Look up the property corresponding to a string in a lookup object
 */


const lookup = R.flip(R.prop);
/**
 * Loads JSON Object from file system. Gets undefined if the file doesn't exist
 * 
 * 
 * @param {String} internalPath file path
 * @param {String} encoding encoding, default is UFT-8
 */

exports.lookup = lookup;

function getJSONFromFile(internalPath, encoding = 'utf8') {
  try {
    return JSON.parse(_fs.default.readFileSync(internalPath, encoding));
  } catch (err) {
    //some errors occurs
    console.error('file % not found', internalPath);
  }

  return undefined;
}
/**
 * Writes a JSON on a file
 * 
 * @param {String} internalPath 
 * @param {Any} json 
 */


function writeJSONToFile(internalPath, json) {
  if (json) {
    try {
      _fs.default.writeFileSync(internalPath, JSON.stringify(json));

      return json;
    } catch (err) {
      //some errors occurs
      console.error('file % not found', internalPath);
    }
  }

  return undefined;
}