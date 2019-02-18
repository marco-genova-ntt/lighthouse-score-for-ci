import SeriesStoreManager from './SeriesStoreManager';
import {uploadFile} from '../aws-s3-manager';
import * as utility from '../utility';

/**
 * Manage the series information on local enironment as mirror of AWS S3 
 */
class AWSSeriesStoreManager extends SeriesStoreManager {
    
    constructor(configuration = {}) {
        super(configuration);
        this._configuration.dbName = utility.extractFileName(this._configuration.path);
    }

    /**
     * Saves all information:
     * 
     * <ol>
     *  <li>In local, then</li>
     *  <li>In AWS</li>
     * </ol>
     * 
     * @param {Any} database all series json 
     */
    saveDatabase (database) {
        super.saveDatabase(database);
        const bucketName = utility.string('AWS_BUCKET_NAME');
        uploadFile(bucketName, this._configuration.dbName, this._configuration.path, 'application/json');
    }
}

export default AWSSeriesStoreManager;