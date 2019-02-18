import R from 'ramda';
import * as utility from '../utility';

/**
 * Gets a new Series Storage initialized.
 * 
 * @param {*} objectRef default object
 */
export function initSeries (objectRef = null) {
    return (objectRef)?[objectRef]:[];
}

/**
 * Adds object to series by key
 * 
 * @param {Array} allSeries all series
 * @param {String} key key f the series
 * @param {Array} objectToAdd object to add
 */
export function addValueToSeries (allSeries, key, objectToAdd) {

    if (objectToAdd && allSeries) {
        const series = getSeries(allSeries, key);
        
        if (series) {
            if (R.length(series) >= utility.number('SERIES_DIMENSION', 45)) {
                series.splice(0, (R.length(series) - utility.number('SERIES_DIMENSION', 45)) + 1);
            } 
   
            allSeries[key] = [...series, objectToAdd];
        } else {
            allSeries[key] = initSeries(objectToAdd);
        }
    }
}

/**
 * Get a series for a key
 * 
 * @param {*} allSeries object of all series
 * @param {*} key key
 */
export function getSeries (allSeries, key) {
    return utility.extractValue(allSeries, key);
}


