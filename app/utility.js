import * as R from 'ramda';
import process from 'process';
import fs from 'fs';
import path from 'path';
import StoreManager from './storage';

const store = new StoreManager(getAbsolutePath('.local_storage.json'));

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
 * @param {*} relativePath optinal relative path to add
 */
export function getAbsolutePath(relativePath = '') {
    return path.join(process.cwd(),relativePath);
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