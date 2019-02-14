import {launchChrome} from './analyzer';
import * as R from 'ramda';

/**
 * Starts an analizer job on pages
 * 
 * @param {Array} pages web pages to analyze 
 * @param {Array} customManagers custom managers for result management
 */
export function analyze(pages, customManagers) {
	if (!R.isNil(pages) && R.length(pages) > 0) {
		launchChrome(pages, customManagers);
	}
}