import Storage from 'node-storage';
import * as R from 'ramda';

/**
 * Manges a simple storage to save data among several runs 
 * Based on node-storage @see https://www.npmjs.com/package/node-storage
 */
class StoreManager {

    constructor(location) {
        this._internalStore = new Storage(location);
    }

    /**
     * Gets value associated to key, if value is empty the default value will be retured and setted on storage
     * 
     * @param {string} key key of the value
     * @param {*} defValue default value
     */
    getValueFromStorage(key, defValue) {
        const value = this._internalStore.get(key);
        return !value?this.setValueToStorage(key, defValue):value;
        
    }

    /**
     * Sets the value 
     * @param {string} key key
     * @param {*} value value
     */
    setValueToStorage(key, value) {
        this._internalStore.put(key, value);
        return R.clone(value);
    }
}

export default StoreManager;