import * as R from 'ramda';
import * as utility from '../../utility';
import { throws } from 'assert';

class SeriesService {

    /**
     * 
     * @param {*} configuration 
     */
    constructor(configuration) {

        if (R.isEmpty(configuration)) {
            this._configuration = {};
        } else {
            this._configuration = R.clone(configuration);
        }
    }

    /**
     * Loads an existent database, otherwise creates it
     */
    loadDatabase () {
        const internalFile = this._configuration.path; 
        const database = utility.getJSONFromFile(internalFile);
        
        if (!database) {
            utility.writeJSONToFile(internalFile, {});
            return {};
        } 

        return database;
    }

    /**
     * Saves the database on file system.
     * 
     *  @param {Any} database 
     */
    saveDatabase (database) {
        if (database) {
            const internalFile = this._configuration.path;
            utility.writeJSONToFile(internalFile, database);
        }
        
        return database;
    }

    get validConfiguration() {
        return {...this._configuration};
    }
}

export default SeriesService;