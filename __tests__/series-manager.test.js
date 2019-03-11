import { populatesPerformancesWithDate, populatesPerformancesWithKey, populatesPerformancesWithEnv } from './../app/allseries/series-manager';
import process from 'process';

test('test base functionality of populatesPerformancesWithDate', () => {
    let performances = {};
    performances = populatesPerformancesWithDate(performances);
    expect(performances).not.toBeUndefined();
    expect(performances).not.toBeNull();
    expect(performances.date).not.toBeUndefined();
    expect(performances.date.length).toBe(19);
});

test('test base functionality of populatesPerformancesWithKey', () => {
    let performances = {url:'test'};
    performances = populatesPerformancesWithKey(performances, '123456');
    expect(performances).not.toBeUndefined();
    expect(performances).not.toBeNull();

    expect(performances.key).not.toBeUndefined();
    expect(performances.processID).not.toBeUndefined();
    expect(performances.processID).toEqual('123456');
});

test('test base functionality of populatesPerformancesWithKey', () => {
    process.env['LIGHTHOUSE_CI_ENV'] = 'toBeTested';
    let performances = {url:'test'};
    performances = populatesPerformancesWithEnv(performances);
    expect(performances).not.toBeUndefined();
    expect(performances).not.toBeNull();

    expect(performances.environment).not.toBeUndefined();
    expect(performances.environment).toEqual('toBeTested');
});
