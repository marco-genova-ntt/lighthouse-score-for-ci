import SeriesStoreManager from './SeriesStoreManager';
import {uploadFile, downloadFile, checkExistence} from '../aws-s3-manager';
import * as utility from '../utility';

class AWSSeriesStoreManager extends SeriesStoreManager {

    constructor(configuration = {}) {
        super(configuration);
        this._configuration.dbName = utility.extractFileName(this._configuration.path);
    }

    loadDatabase () {
        const bucketName = utility.string('AWS_BUCKET_NAME');
        checkExistence(bucketName, this._configuration.dbName).then ((existence) => {
            if (existence) {
                downloadFile(bucketName, this._configuration.dbName, this._configuration.path);
            }

            return super.loadDatabase();
        }).catch(function(err) {
            console.error(err, err.stack);
        });
    }

    saveDatabase (database) {
        super.saveDatabase(database);
        const bucketName = utility.string('AWS_BUCKET_NAME');
        uploadFile(bucketName, this._configuration.dbName, this._configuration.path, 'application/json');
    }
}

export default AWSSeriesStoreManager;