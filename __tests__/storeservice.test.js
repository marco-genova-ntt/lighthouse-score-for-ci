import SeriesService from './../app/allseries/services/SeriesService';

test('check constructuor', () => {
    const storeService = new SeriesService(undefined);
    expect(storeService.validConfiguration).toEqual({});
});


test('check base Configuration', () => {
    const storeService = new SeriesService({path:'my-path'});
    expect(storeService.validConfiguration.path).toEqual('my-path');
});


test('check save and load database', () => {
    const storeService = new SeriesService({path:'./tmp/database.json'});
    const dataBase = {property : "value"};
    expect(storeService.saveDatabase(dataBase)).not.toBeUndefined();

    const readDatabase = storeService.loadDatabase(); 
    expect (readDatabase).toEqual(dataBase);
});