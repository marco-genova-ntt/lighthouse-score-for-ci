import {mapAllSeries, transformEntry, byDate} from '../app/allseries/index-serie-report';
import process from 'process';

test('checks all series mapping', () => {
    process.env['SERIES_AWS_S3_TEMPLATE_RESOURCE'] = 'https://s3.eu-north-1.amazonaws.com/test.lighthouse/{hashcode}.html';

    let allSeries = {
        "key-value" : [
            {
              "performance": 32,
              "accessibility": 48,
              "bestpractices": 71,
              "seo": 100,
              "pwa": 31,
              "url": "https://www.leroymerlin.it/prodotti/specchi-bagno-CAT35-c",
              "date": "2019-02-18 11:02:22",
              "key": "key-value",
              "processID": 178,
              "environment" : "toBeTested"
            }
        ]
    };

    let mappedSeries = mapAllSeries(allSeries);
    console.log(JSON.stringify(mappedSeries));
    expect(mappedSeries[0].env).toEqual('toBeTested');
    expect(mappedSeries[0].refEnv).toEqual('https://www.leroymerlin.it/prodotti/specchi-bagno-CAT35-c');
    expect(mappedSeries[0].date).toEqual('2019-02-18 11:02:22');
    expect(mappedSeries[0].trend).toEqual('https://s3.eu-north-1.amazonaws.com/test.lighthouse/key-value.html');
});