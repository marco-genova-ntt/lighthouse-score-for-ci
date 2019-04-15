import {evaluatesThresholds, forceErrorOnExit, THRESHOLDS_COUNTER_ID} from '../app/thresholds/thresholds-manager';
import StoreManager from '../app/StoreManager';
import * as utility from '../app/utility';

test('thresholds evaluation', () => {
    /*utility.store = new StoreManager(utility.getAbsolutePath('dist/__tests__/tmp/.test_storage_thresholds.json'));

    let performances = {
        date: '2019-02-14',
        performance: 1,
        accessibility: 2,
        bestpractices: 3,
        seo:4,
        pwa:5
    };

    let lighthouserc = {
        "thresholds": {
          "performance": 90.25,
          "pwa": 90.25,
          "bestpractices": 90.25,
          "seo": 90.25,
          "accessibility": 90.25
        }
    }
    
    evaluatesThresholds(performances, lighthouserc['thresholds']);
    expect(utility.getCounter(THRESHOLDS_COUNTER_ID)).toBe(5);
    utility.resetCounter(THRESHOLDS_COUNTER_ID);

    
    performances = {
        date: '2019-02-14',
        performance: 100,
        accessibility: 100,
        bestpractices: 100,
        seo:4,
        pwa:5
    };

    evaluatesThresholds(performances, lighthouserc['thresholds']);
    expect(utility.getCounter(THRESHOLDS_COUNTER_ID)).toBe(2);
    utility.resetCounter(THRESHOLDS_COUNTER_ID);
    
    forceErrorOnExit(100);*/
});
