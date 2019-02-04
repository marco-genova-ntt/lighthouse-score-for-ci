import {launchChrome} from './analyzer';
import * as R from 'ramda';
import * as utility from './utility';

/**
 * Start an analizer job 
 * 
 * @param {Array} pages web pages to analyze 
 * @param {Array} customManagers custom managers for result management
 */
export function analyze(pages, customManagers) {
	const processID = utility.getProgressiveCounter();

	if (!R.isNil(pages) && R.length(pages) > 0) {
		launchChrome(processID, pages, customManagers);
	}
}