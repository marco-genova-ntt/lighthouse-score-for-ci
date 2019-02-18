import {remapPerformances, createHTMLReport} from '../app/allseries/serie-report';
import R from 'ramda';
import process from 'process';

test('test base functionality of populatesPerformancesWithDate', () => {
    let performances = {
        date: '2019-02-14',
        performance: 1,
        accessibility: 2,
        bestpractices: 3,
        seo:4,
        pwa:5
    };

    const data = R.map(remapPerformances,[performances]);

    expect(data).not.toBeUndefined();
    expect(data).not.toBeNull();
    expect(data).toEqual([['2019-02-14',1,2,3,4,5]]);
});

test('test base functionality of createHTMLReport', () => {
    let performances = {
        date: '2019-02-14',
        performance: 1,
        accessibility: 2,
        bestpractices: 3,
        seo:4,
        pwa:5
    };

    process.env['SERIES_ENABLE_TREND_REPORT_ON_AWS'] = false;
    const data = R.map(remapPerformances,[performances]);

    createHTMLReport('key.prova','./tmp/testkey.prova.html', data);
});
