import {launchChromeAndRunLighthouse,defaultLighthouseManager} from './analyzer';

launchChromeAndRunLighthouse('https://www.leroymerlin.it/prodotti/specchi-bagno-CAT35-c')
	.then(defaultLighthouseManager)
	.catch((err) => console.error("error during job execution: %s", err.message));
