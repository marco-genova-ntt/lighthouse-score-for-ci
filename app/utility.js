import R from 'ramda';
import process from 'process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import StoreManager from './StoreManager';
import AWSStoreManager from './AWSStoreManager';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env')});
let store;

///XXX implement factory mode
if(bool('AWS_S3_WRITING_ENABLED')) {
  store = new AWSStoreManager(getAbsolutePath('.local_storage.json'));
  console.info('storage mode: AWS');
} else {
  store = new StoreManager(getAbsolutePath('.local_storage.json'));
  console.info('storage mode: LOCAL');
}

/**
 * Gets a string environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {String} defaultVal - The default value to use.
 *
 * @return {String} The value.
 */
export function string(name, defaultVal = '') {
    return process.env[name] || defaultVal;
}

/**
 * Gets a number environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {number} defaultVal - The default value to use.
 *
 * @return {number} The value.
 */
export function number(name, defaultVal = 0) {
    return process.env[name] ? parseInt(process.env[name], 10) : defaultVal;
}

/**
 * Gets a bool environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {bool} defaultVal - The default value to use.
 *
 * @return {bool} The value.
 */
export function bool(name, defaultVal = false) {
    return process.env[name] ? process.env[name] === 'true' || process.env[name] === '1' : defaultVal;
}

/**
 * Replaces a part of phrase with a new value. 
 * Placeholder formart {placeholder}
 * 
 * @param {string} phrase 
 * @param {string} toReplace 
 * @param {string} withValue 
 */
export function replace(phrase = '', toReplace = '', withValue = '') {
    return R.replace(`{${toReplace}}`, withValue, phrase);
}

/**
 * Concat all string of fields {string}
 */
export const concatAll = R.unapply(R.reduce(R.concat, ''));

/**
 * Generates random integer 
 * 
 * @param {*} low low value
 * @param {*} high high value
 */
export function randomInt(low = 0, high = 100) {
    return Math.floor(Math.random() * (high - low) + low)
}

/**
 * Gets absolute path adding an optional relative path
 * 
 * @param {*} relativePath optional relative path to add
 */
export function getAbsolutePath(relativePath = '') {
    return path.join(process.cwd(),relativePath);
}

/**
 * Extracts file name from path.
 * 
 * @param {String} relativePath path to analyze
 */
export function extractFileName (relativePath = '') {
    return path.basename(relativePath);
}

/**
 * Gets a counter of a progressive values among runs.
 * Parameter is optional an internal store is used
 * 
 * @param {StoreManager} specificStore optional store
 */
export function getProgressiveCounter(specificStore) {
    const storeToUse = specificStore?specificStore:store;
    return storeToUse.setValueToStorage('COUNTER', R.inc(storeToUse.getValueFromStorage('COUNTER', 0)));
}

/**
 * Creates a not existent directory in recursive way. (Support Node <= 10.11.0)
 * 
 * @param {*} targetDir the child file or directory
 * @param {*} params
 */ 
export function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';
  
    return targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      
      try {
        fs.mkdirSync(curDir);
      } catch (err) {
        if (err.code === 'EEXIST') { // curDir already exists!
          return curDir;
        }
  
        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }
  
        const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
        if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
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
export function extractValue (refObject, idProperty) {
  const hasProperty = R.has(idProperty);
  
  if (refObject && hasProperty(refObject)) {
      return R.clone(refObject[idProperty]);
  }

  return undefined;
}

/**
 * Look up the property corresponding to a string in a lookup object
 */
export const lookup = R.flip(R.prop);

/**
 * Loads JSON Object from file system. Gets undefined if the file doesn't exist
 * 
 * 
 * @param {String} internalPath file path
 * @param {String} encoding encoding, default is UFT-8
 */
export function getJSONFromFile(internalPath, encoding = 'utf8') {
  
  try {
    return JSON.parse(fs.readFileSync(internalPath, encoding))
  } catch (err) {
    //some errors occurs
    console.error('file ',internalPath,' not found');
  }
  
  return undefined;
}

/**
 * Writes a JSON on a file
 * 
 * @param {String} internalPath 
 * @param {Any} json 
 */
export function writeJSONToFile (internalPath, json) {
  
  if (json) {
    try {
      return writeContentToFile(internalPath, JSON.stringify(json));
    } catch (err) {
      //some errors occurs
      console.error('file ',internalPath,' not found');
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
export function writeContentToFile (internalPath, content) {
  
  if (content) {
    try {
      fs.writeFileSync(internalPath, content);
      return json;
    } catch (err) {
      //some errors occurs
      console.error('file ',internalPath,' not found');
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
export function createHash (data, algorithm = 'md5', digestType = 'hex') {
  return crypto.createHash(algorithm).update(data).digest(digestType);
}

/**
 * Gets a a date string in the format 'YYYY-MM-DD hh:mm:ss'
 */
export function nowUTC() {
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
export function escapeRegExp(str) {
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
export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/**
 * Gets a cloned prop of an object
 */
export const getClonedProp = R.pipe(R.prop, R.clone);