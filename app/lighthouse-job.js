import {launchChrome} from './analyzer';
import * as R from 'ramda';

/**
 * Start an analizer job 
 * 
 * @param {*} pages web pages to analyze 
 */
export function analyze(pages) {

	if (!R.isNil(pages) && R.length(pages) > 0) {
		launchChrome(pages);
	}
}