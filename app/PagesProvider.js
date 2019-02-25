import R from 'ramda';
import * as utility from './utility';
import path from 'path';

/**
 * This class is used to provide a set of pages extracted from filesystem.
 * The set of pages is cut by environment
 */
class PagesProvider {

    constructor(configuration = {}) {
        this._baseFile = configuration.baseFile ? configuration.baseFile : 'pages.json';
        this._absoluteFile = path.join(process.cwd(), this._baseFile);
    }

    /**
     * Loads page as state of object from filesystem 
     */
    loadPages () {
        this._pages = utility.getJSONFromFile(this._absoluteFile);
    }

    /**
     * Works a set of page for the context
     * 
     * @param {String} context identifier of the ernviroment ot use
     * @param {Function} worker function to work pages
     */
    worksOnPages(context = 'default', worker) {
        if (!R.isEmpty(this._pages) && worker) {
            const pagesSet = utility.getClonedProp(context, this._pages);
            if (R.length(pagesSet) > 0) {
                R.call(worker, R.clone(pagesSet));
            }
        }
    }

    /**
     * Gets the whole set of pages
     */
    get pages() {
        return {...this._pages};
    }
}

export default PagesProvider;