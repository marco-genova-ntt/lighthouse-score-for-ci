import StoreManager from "./StoreManager";
import R from 'ramda';
import * as utility from './utility';
import {uploadFile} from './aws-s3-manager';

/**
 * Exposes the same functionalities of @see StoreManager but for the function
 * _setValueToStorage_ upload the file after changes. The storage is based on the local copy
 */
class AWSStoreManager extends StoreManager {

    /**
     * Sets the value 
     * @param {string} key key
     * @param {*} value value
     */
    setValueToStorage(key, value) {
        this._internalStore.put(key, value);
        const bucketName = utility.string('AWS_BUCKET_NAME');
        uploadFile(bucketName, '.local_storage.json', this._location, 'application/json');
        return R.clone(value);
    }
}

export default AWSStoreManager;