import fs from 'fs';
import R from 'ramda';
import * as utility from '../utility';

/**
 * Generates a file report on the disk based on the template defned by environment variale (SERIES_TEMAPLTE_TREND_FILE)
 * 
 * @param {String} fileName report file name
 * @param {Array} serie array of performance
 */
export function createHTMLReport(fileName, serie) {
    if (serie && R.length(serie) > 0) {
        const content = fs.readFileSync(utility.string('SERIES_TEMAPLTE_TREND_FILE','./templates/series/anychart-template.txt'), 'utf-8');
        const data = R.map(remapPerformances, serie);
        const result = content.toString().replace('${data_seeds}', JSON.stringify(data));
        
        fs.writeFile(fileName, result, function (error) {
            if (error) throw error;
        });
    }
}

/**
 * Remap a single set of performances in an array of score values, composed by:
 * 
 * <ol>
 * <li>date of execution</li>
 * <li>performance</li>
 * <li>accessibility</li>
 * <li>bestpractive</li>
 * <li>seo</li>
 * <li>pwa</li>
 * </ol>
 * 
 * @param {Object} values 
 */
export const remapPerformances = values => [values.date,values.performance,values.accessibility,values.bestpractices,values.seo,values.pwa];