import SeriesStoreManager from '../app/allseries/AWSSeriesStoreManager';
import process from 'process';

test('check constructuor', () => {
    process.env['SERIES_SERVICE_DATABASE_FILE'] = './tmp/database.json';
    const storeService = new SeriesStoreManager();
    expect(storeService.validConfiguration).toEqual({"path": "./tmp/database.json","dbName":"database.json"});
    expect(storeService.validConfiguration.dbName).toEqual('database.json');
});