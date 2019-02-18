import { populatesPerformancesWithDate, populatesPerformancesWithKey } from './../app/allseries/series-manager';

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