import SeriesStoreManager from './../app/allseries/SeriesStoreManager';
import process from 'process';

test('check constructuor', () => {
    process.env['SERIES_SERVICE_DATABASE_FILE'] = './tmp/database.json';
    const storeService = new SeriesStoreManager();
    expect(storeService.validConfiguration).toEqual({"path": "./tmp/database.json"});
});

test('check base Configuration', () => {
    const storeService = new SeriesStoreManager({path:'my-path'});
    expect(storeService.validConfiguration.path).toEqual('my-path');
});

test('check save and load database', () => {
    process.env['SERIES_DIMENSION'] = 4;
    const storeService = new SeriesStoreManager({path:'./tmp/database.json'});
    const dataBase = {property : "value"};
    expect(storeService.saveDatabase(dataBase)).not.toBeUndefined();

    const readDatabase = storeService.loadDatabase(); 
    expect (readDatabase).toEqual(dataBase);
});