import * as dbSeries from '../app/allseries/db-series';
import process from 'process';

test('check init series', () => {
    expect(dbSeries.initSeries()).toEqual([]);
});

test('check init series with default value', () => {
    let myobject = ['uno'];
    let series = dbSeries.initSeries(myobject);

    expect(series[0]).toBe(myobject);
});

test('check add values in different ways', () => {
    let myObject = ['uno'];
    let allSeries = {};

    dbSeries.addValueToSeries(allSeries,'uno', myObject);
    expect(allSeries['uno'][0]).toEqual(myObject);

    let dueObject = ['due'];
    dbSeries.addValueToSeries(allSeries,'uno', dueObject);
    expect(allSeries['uno'][1]).toEqual(dueObject);

    let treObject = ['tre'];
    dbSeries.addValueToSeries(allSeries,'quattro', treObject);
    expect(allSeries['quattro'][0]).toEqual(treObject);
});

test('check add values limit to 4', () => {
    process.env['SERIES_DIMENSION'] = 4;

    let uno = ['uno'];
    let due = ['due'];
    let tre = ['tre'];
    let quattro = ['quattro'];
    let cinque = ['cinque'];

    let allSeries = {};

    dbSeries.addValueToSeries(allSeries,'uno', uno);
    dbSeries.addValueToSeries(allSeries,'uno', due);
    dbSeries.addValueToSeries(allSeries,'uno', tre);
    dbSeries.addValueToSeries(allSeries,'uno', quattro);

    expect(allSeries['uno'].length).toBe(4);
    expect(allSeries['uno'][0]).toEqual(uno);

    dbSeries.addValueToSeries(allSeries,'uno', cinque);
    dbSeries.addValueToSeries(allSeries,'uno');

    expect(allSeries['uno'][0]).toEqual(due);
    expect(allSeries['uno'][1]).toEqual(tre);
    expect(allSeries['uno'][2]).toEqual(quattro);
    expect(allSeries['uno'][3]).toEqual(cinque);
});

test('check keys from getSerieKeys', () => {
    let myObject = ['uno'];
    let allSeries = {};
    dbSeries.addValueToSeries(allSeries,'uno', myObject);
    let dueObject = ['due'];
    dbSeries.addValueToSeries(allSeries,'uno', dueObject);
    let treObject = ['tre'];
    dbSeries.addValueToSeries(allSeries,'quattro', treObject);

    let serieKeys = dbSeries.getSerieKeys(allSeries);
    expect(serieKeys).toEqual(['uno','quattro']);
});