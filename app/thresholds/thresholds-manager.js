import * as lfs from 'lighthouse-score-for-slack';
import {improveCounter, resetCounter, getCounter, getJSONFromFile, getAbsolutePath} from '../utility';
import process from 'process';
import path from 'path';

/**
 * Error code for exit on thresholds violation
 */
export const EXIT_CODE_THRESHOLDS_NOT_REACHED = 32;

/**
 * Counter Identifier
 */
export const THRESHOLDS_COUNTER_ID = 'THRESHOLDS_COUNTER_ID';

/**
 * KPI identifiers used
 */
export const PERFORMANCES_IDS = ['performance', 'accessibility', 'bestpractices', 'seo', 'pwa'];

/**
 * 
 * @param {String} processID 
 * @param {String} page 
 * @param {Object} results 
 */
export function dispatchThresholdsEvaluation(processID = '000000', page = '', results) {
    if (results) {
        const performances = lfs.extractPerformanceValues(results);
        const lighthouseThresholds = getJSONFromFile(getAbsolutePath('lighthouse-thresholds.json'));

        console.log(JSON.stringify(lighthouseThresholds));
        evaluatesThresholds(performances, lighthouseThresholds['thresholds']);
    }
}

/**
 * Evaluates thresholds on perfomances
 * 
 * @param {Object} performances KPI set 
 * @param {Object} thresholds thresolds set 
 */
export function evaluatesThresholds (performances, thresholds) {
    if (performances) {
        PERFORMANCES_IDS.forEach(id => {
            if(!checkThreshold(id, performances, thresholds)) {
                improveCounter(THRESHOLDS_COUNTER_ID);
            }
        });
    }
}

/**
 * Checks single value 
 * 
 * @param {String} key KPI id
 * @param {Object} performances KPI set 
 * @param {Object} thresholds thresolds set
 */
export function checkThreshold(key, performances, thresholds) {
    if (key && performances[key] && thresholds[key]) {
        const value = parseFloat(performances[key]);
        const threshold = parseFloat(thresholds[key]);
        console.debug("value: ", value, " vs threshold: ", threshold);
        return value >= threshold;
    }

    return true;
}

/**
 * Forces error on exit if thresholds are violated
 * 
 *  @param {Object} threshold thresolds set
 */
export function forceErrorOnExit (threshold = 0) {
    if(getCounter(THRESHOLDS_COUNTER_ID) > threshold) {
        resetCounter(THRESHOLDS_COUNTER_ID);
        console.error('Violated constraints, check reports for details');
        process.exit(EXIT_CODE_THRESHOLDS_NOT_REACHED);
    }
}
