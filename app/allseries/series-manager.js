import SeriesStoreManager from './SeriesStoreManager';
import AWSSeriesStoreManager from './AWSSeriesStoreManager';
import * as dbSeries from './db-series';
import * as utility from '../utility';
import * as lfs from 'lighthouse-score-for-slack';
import {createHTMLReport} from './serie-report';
import { createIndex } from './index-serie-report';

let seriesStoreManager;

///XXX implement factory mode
if(utility.bool('SERIES_SERVICE_DATABASE_FILE_ON_AWS')) {
    seriesStoreManager = new AWSSeriesStoreManager();
    console.info('trend report mode: AWS');
} else {
    seriesStoreManager = new SeriesStoreManager();
    console.info('trend report mode: LOCAL');
}

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
 * 
 * @param {*} processID process analysis identifier 
 * @param {*} page references page
 * @param {*} results lighthouse complete results set
 */
export function dispatchSeriesManager(processID = '000000', page = '', results) {

    if (results) {
        //load database 
        let allSeries = seriesStoreManager.loadDatabase();

        //extract performances
        let performances = lfs.extractPerformanceValues(results);
        performances = populatesPerformancesWithDate(performances);
        performances = populatesPerformancesWithKey(performances, processID);
        performances = populatesPerformancesWithEnv(performances);
        
        //add to performances
        dbSeries.addValueToSeries(allSeries, performances.key, performances);
        seriesStoreManager.saveDatabase(allSeries);

        if(utility.bool('SERIES_ENABLE_TREND_REPORT')) {
            createHTMLReport(`${performances.key}.html`, 
              utility.getAbsolutePath(`tmp/${performances.key}.html`), 
              dbSeries.getSeries(allSeries, performances.key));
            createIndex(utility.getAbsolutePath('tmp/index.html'), allSeries);
        }
    }
}

/**
 * Populates performanecs object with _date:now time_. The time is in format *YYYY-MM-DD hh:mm:ss*
 * 
 * @param {Object} performances lighthouse performances set
 */
export function populatesPerformancesWithDate(performances = {}) {
    return {...performances, date: utility.nowUTC()};
}

/**
 * Populates performanecs object with:
 * 
 *  _key_:_hash code of url_
 * 
 *  _processID:processID_
 * 
 * @param {Object} performances lighthouse performances set
 */
export function populatesPerformancesWithKey(performances, processID = '000000') {
    return {...performances, key: utility.createHash(performances.url), processID: processID};
}

/**
 * Populates performanecs object with prop _environment:envID_
 * 
 * @param {Object} performances 
 */
export function populatesPerformancesWithEnv(performances = {}) {
    return {...performances, environment: utility.string('LIGHTHOUSE_CI_ENV')};
}