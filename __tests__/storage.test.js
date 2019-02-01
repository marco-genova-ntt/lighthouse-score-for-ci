import * as utility from '../app/utility';
import StoreManager from '../app/storage';

test('check progressive counter', () => {
    const testStore = new StoreManager(utility.getAbsolutePath('dist/__tests__/tmp/.test_storage.json'));
    expect(testStore.setValueToStorage('COUNTER', 0)).toBe(0);
    expect(utility.getProgressiveCounter(testStore)).toBe(1);
    expect(utility.getProgressiveCounter(testStore)).toBe(2);
});