import fs from 'fs';
import R from 'ramda';
import * as utility from '../utility';
import {uploadFile} from '../aws-s3-manager';
import {remapPerformances} from './serie-report';
import * as dbSeries from './db-series';

/**
 * Create Index Pages. The pages is saved in a file system and, optianelly, loaded on AWS S3
 * 
 * @param {String} fileName absolute file name
 * @param {Object} allSeries all performance series 
 */
export function createIndex(fileName, allSeries) {

    if (allSeries) {
        const allAnalysisRun = mapAllSeries(allSeries);
        const content = fs.readFileSync(utility.string('SERIES_TEMAPLTE_INDEX_FILE','./templates/series/index.txt'), 'utf-8');
        const result = utility.replaceAll(content.toString().replace('${data_seeds}', JSON.stringify(allAnalysisRun)),'${date}', utility.nowUTC());

        fs.writeFile(fileName, result, function (error) {
            if (error) throw error;

            if(utility.bool('SERIES_ENABLE_TREND_REPORT_ON_AWS')) {
                const bucketName = utility.string('AWS_BUCKET_NAME');
                uploadFile(bucketName, 'index.html', fileName);
            }
        });
    }
}

/**
 * Transform all entries for a key in one array of transformed entries
 * 
 * @param {Object} allSeries 
 */
export function mapAllSeries (allSeries) {
  const serieKeys = dbSeries.getSerieKeys(allSeries);
  let allAnalysisRuns = [];

  if (serieKeys && R.length(serieKeys) > 0) {
    for(let i = 0; i < serieKeys.length ; i++) {
        let series = dbSeries.getSeries(allSeries, serieKeys[i]);
        allAnalysisRuns = [...allAnalysisRuns, ...R.map(transformEntry, series)];
    }
  }
  
  return R.sort(byDate, allAnalysisRuns);
}

/**
 * Transform an performances entry in a entry for the template 
 * 
 * @param {Object} performances oerformances object
 */
export function transformEntry(performances) {
  const template = utility.string('SERIES_AWS_S3_TEMPLATE_RESOURCE','');

  return {
    env: performances.environment,
    text: `Analysis Run ${performances.processID} on [${performances.date}]`,
    trend: template.replace('{hashcode}', performances.key),
    report: template.replace('{hashcode}', utility.fileNameEnvBased(`${performances.processID}`)),
    refEnv: performances.url,
    values: remapPerformances(performances),
    date: performances.date
  };
}

/**
 * Comparator by _date_ prop
 */
export const byDate = R.comparator((a, b) => a.date > b.date);