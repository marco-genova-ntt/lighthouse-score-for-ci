import {launchChromeAndRunLighthouse,defaultLighthouseManager} from './analyzer';
import * as R from 'ramda';

export function analyze(pages) {

	if (!R.isNil(pages) && R.length(pages) > 0) {
		const runner = page => launchChromeAndRunLighthouse(page)
			.then(defaultLighthouseManager)
			.catch((err) => console.error("error during job execution: %s, [STACK] %s", err.message, err.stack));

		R.forEach(runner, pages);
	}
}

