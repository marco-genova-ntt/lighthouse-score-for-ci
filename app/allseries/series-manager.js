import SeriesService from './services/SeriesService';
import * as dbSeries from './db-series';
import * as utility from '../utility';
import * as lfs from 'lighthouse-score-for-slack';

const seriesService = new SeriesService();

/**
 * Manges series:
 * 
 * <ol>
 *  <li>load from source all series</li>
 *  <li>chek lighthouse performances</li>
 *  <li>enforce performances</li>
 *  <li>add new serie</li>
 *  <li>save all series</li>
 * </ol>
 * @param {*} processID process analysis identifier 
 * @param {*} page references page
 * @param {*} results lighthouse complete results set
 */
export function dispatchSeriesManager(processID = '000000', page = '', results) {

    if (results) {
        //load database 
        let allSeries = seriesService.loadDatabase();

        //extract performances
        let performances = lfs.extractPerformanceValues(results);
        performances = populatesPerformancesWithDate (performances);
        performances = populatesPerformancesWithKey(performances, processID);
        
        //add to performances
        dbSeries.addValueToSeries(allSeries, performances.key, performances);
        seriesService.saveDatabase(allSeries);
    }
}

/**
 * Populates performanecs object with <i>date</i>:<i>now time</i>. The time is in format <i>YYYY-MM-DD hh:mm:ss</i>
 * 
 * @param {*} performances lighthouse performances set
 */
export function populatesPerformancesWithDate(performances = {}) {
    return {...performances, date: utility.nowUTC()};
}

/**
 * Populates performanecs object with:
 * 
 * <ol>
 *  <li><i>key</i>:<i>hash code of url</i></li> 
 *  <li><i>processID</i>:<i>processID</i></li>
 * </ol>
 * 
 * @param {*} performances lighthouse performances set
 */
export function populatesPerformancesWithKey(performances, processID = '000000') {
    return {...performances, key: utility.createHash(performances.url), processID: processID};
}