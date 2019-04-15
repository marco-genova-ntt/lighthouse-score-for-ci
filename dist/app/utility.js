"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.realoadStorageDatabase = realoadStorageDatabase;
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
exports.writeContentToFile = writeContentToFile;
exports.createHash = createHash;
exports.nowUTC = nowUTC;
exports.escapeRegExp = escapeRegExp;
exports.replaceAll = replaceAll;
exports.fileNameEnvBased = fileNameEnvBased;
exports.manageGenericError = manageGenericError;
exports.improveCounter = improveCounter;
exports.resetCounter = resetCounter;
exports.getCounter = getCounter;
exports.getClonedProp = exports.lookup = exports.concatAll = exports.EXTI_CODE_ERROR_NOT_MANAGED = void 0;

var _ramda = _interopRequireDefault(require("ramda"));

var _process = _interopRequireDefault(require("process"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _crypto = _interopRequireDefault(require("crypto"));

var _StoreManager = _interopRequireDefault(require("./StoreManager"));

var _AWSStoreManager = _interopRequireDefault(require("./AWSStoreManager"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EXTI_CODE_ERROR_NOT_MANAGED = 31;
exports.EXTI_CODE_ERROR_NOT_MANAGED = EXTI_CODE_ERROR_NOT_MANAGED;

_dotenv.default.config({
  path: _path.default.join(_process.default.cwd(), '.env')
});

let store;
/**
 * Realoads storage from fileSystem
 */

function realoadStorageDatabase() {
  ///XXX implement factory mode
  if (bool('AWS_S3_WRITING_ENABLED')) {
    store = new _AWSStoreManager.default(getAbsolutePath('.local_storage.json'));
    console.info('storage mode: AWS');
  } else {
    store = new _StoreManager.default(getAbsolutePath('.local_storage.json'));
    console.info('storage mode: LOCAL');
  }
}

realoadStorageDatabase();
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
 * @deprecated @see improveCounter
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
      return writeContentToFile(internalPath, JSON.stringify(json));
    } catch (err) {
      //some errors occurs
      console.error('file ', internalPath, ' not found');
    }
  }

  return undefined;
}
/**
 * Writes text conent on a file
 * 
 * @param {String} internalPath 
 * @param {String} content 
 */


function writeContentToFile(internalPath, content) {
  if (content) {
    try {
      _fs.default.writeFileSync(internalPath, content);

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
/**
 * Gets a cloned prop of an object
 */


const getClonedProp = _ramda.default.pipe(_ramda.default.prop, _ramda.default.clone);
/**
 * Adds prefix to file name
 * 
 * @param {String} suffix original file name
 */


exports.getClonedProp = getClonedProp;

function fileNameEnvBased(suffix = '') {
  return `${string('LIGHTHOUSE_CI_ENV', 'not-defined')}-${suffix}`;
}
/**
 * Manages the error not cought in the correct way.
 * PLEASE correct the behavior if you see trace in the log
 * 
 * @param {Error} err error information
 */


function manageGenericError(err) {
  console.error('WARNING NOT MANAGED ERROR!!! PLEASE CORRECT!!!', err);

  if (err) {
    _process.default.exit(EXTI_CODE_ERROR_NOT_MANAGED);
  }
}
/**
 * Imporve a counter (+1) in the StoreManager
 * 
 * @param {String} counter counter identifier
 * @param {StoreManager} specificStore specific store, if null the default will be used
 */


function improveCounter(counter, specificStore) {
  if (counter) {
    const storeToUse = specificStore ? specificStore : store;
    return storeToUse.setValueToStorage(counter, _ramda.default.inc(storeToUse.getValueFromStorage(counter, 0)));
  }

  return 0;
}
/**
 * Resets to 0 the value
 * 
 * @param {String} counter counter identifier
 * @param {StoreManager} specificStore specific store, if null the default will be used
 */


function resetCounter(counter, specificStore) {
  if (counter) {
    const storeToUse = specificStore ? specificStore : store;
    return storeToUse.setValueToStorage(counter, 0);
  }

  return 0;
}
/**
 * Gets the value of counter
 *  
 * @param {String} counter counter identifier
 * @param {StoreManager} specificStore specific store, if null the default will be used
 */


function getCounter(counter, specificStore) {
  if (counter) {
    const storeToUse = specificStore ? specificStore : store;
    return storeToUse.getValueFromStorage(counter, 0);
  }

  return 0;
}