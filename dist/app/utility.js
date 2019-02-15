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
exports.extractFileName = extractFileName;
exports.getProgressiveCounter = getProgressiveCounter;
exports.mkDirByPathSync = mkDirByPathSync;
exports.extractValue = extractValue;
exports.getJSONFromFile = getJSONFromFile;
exports.writeJSONToFile = writeJSONToFile;
exports.createHash = createHash;
exports.nowUTC = nowUTC;
exports.escapeRegExp = escapeRegExp;
exports.replaceAll = replaceAll;
exports.lookup = exports.concatAll = void 0;

var _ramda = _interopRequireDefault(require("ramda"));

var _process = _interopRequireDefault(require("process"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _crypto = _interopRequireDefault(require("crypto"));

var _storage = _interopRequireDefault(require("./storage"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const store = new _storage.default(getAbsolutePath('.local_storage.json'));

_dotenv.default.config({
  path: _path.default.join(_process.default.cwd(), '.env')
});
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
  return _ramda.default.replace(`{${toReplace}}`, withValue, phrase);
}
/**
 * Concat all string of fields {string}
 */


const concatAll = _ramda.default.unapply(_ramda.default.reduce(_ramda.default.concat, ''));
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
 * @param {*} relativePath optional relative path to add
 */


function getAbsolutePath(relativePath = '') {
  return _path.default.join(_process.default.cwd(), relativePath);
}
/**
 * Extracts file name from path.
 * 
 * @param {String} relativePath path to analyze
 */


function extractFileName(relativePath = '') {
  return _path.default.basename(relativePath);
}
/**
 * Gets a counter of a progressive values among runs.
 * Parameter is optional an internal store is used
 * 
 * @param {StoreManager} specificStore optional store
 */


function getProgressiveCounter(specificStore) {
  const storeToUse = specificStore ? specificStore : store;
  return storeToUse.setValueToStorage('COUNTER', _ramda.default.inc(storeToUse.getValueFromStorage('COUNTER', 0)));
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
  const hasProperty = _ramda.default.has(idProperty);

  if (refObject && hasProperty(refObject)) {
    return _ramda.default.clone(refObject[idProperty]);
  }

  return undefined;
}
/**
 * Look up the property corresponding to a string in a lookup object
 */


const lookup = _ramda.default.flip(_ramda.default.prop);
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
    console.error('file ', internalPath, ' not found');
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

      console.error('file written: ', internalPath);
      return json;
    } catch (err) {
      //some errors occurs
      console.error('file ', internalPath, ' not found');
    }
  }

  return undefined;
}
/**
 * Based on crypt module.
 * Creates hash, updates data ang digests the result
 * 
 * @param {String} data 
 * @param {String} algorithm, default MD5
 * @param {String} digestType, default hex 
 */


function createHash(data, algorithm = 'md5', digestType = 'hex') {
  return _crypto.default.createHash(algorithm).update(data).digest(digestType);
}
/**
 * Gets a a date string in the format 'YYYY-MM-DD hh:mm:ss'
 */


function nowUTC() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
/**
 * Regular expressions contain special (meta) characters, and as such it is 
 * dangerous to blindly pass an argument in the find function above without 
 * pre-processing it to escape those characters. 
 * This is covered in the Mozilla Developer Network's JavaScript Guide on Regular Expressions, 
 * where they present the following utility function.
 * 
 * @see https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
 * @param {*} str string to escape
 */


function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
/**
 * Replaces all occurrence partial strings. 
 * Sustitute ramda functionality.
 * 
 * @see https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
 * 
 * @param {*} str string to escape
 * @param {*} find part of string to replace
 * @param {*} replace string to add for replace
 */


function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}