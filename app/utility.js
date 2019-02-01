import * as R from 'ramda';
import process from 'process';
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