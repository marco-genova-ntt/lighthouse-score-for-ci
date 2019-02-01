'use strict';

/* eslint-disable */

const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');


/*
 * chrome launcher docs: https://www.npmjs.com/package/chrome-launcher
 * config lighthouse ref: https://github.com/GoogleChrome/lighthouse/blob/888bd6dc9d927a734a8e20ea8a0248baa5b425ed/typings/externs.d.ts#L82-L119
 * lighthouse results: https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md
 */
function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.lhr)
    });
  });
}

const opts = {
	//https://github.com/GoogleChrome/lighthouse
  chromeFlags: [
	 //'--disable-device-emulation',
   '--print-config',
	 //'--port port-number',
	 '--headless'
  ],
	outputConf: {
		directory: '../_reports',
		extraStyle: true
	},
	emulatedFormFactor: 'desktop',//'mobile'|'desktop'|'none'
	disableDeviceEmulation: false,
	throttlingMethod: 'simulate'//'devtools'|'simulate'|'provided'
};

/*const config = {
	emulatedFormFactor: 'desktop'
}*/

launchChromeAndRunLighthouse('https://www.leroymerlin.it/prodotti/specchi-bagno-CAT35-c', opts).then(results => {
  // Use results
	const html = ReportGenerator.generateReportHtml(results);
	const basePath = path.join(__dirname, opts.outputConf.directory);
  const processID = uuidv4();
	const filePath = path.join(basePath, `${processID}.html`);
	fs.writeFileSync(filePath, html, {encoding: 'utf-8'});

	if (opts.outputConf.extraStyle) {
		// Create Devtools report that's denser
		// TODO: add in extra styles that devtools manually injects
		const devtoolshtml = html
			 .replace(`"lh-root lh-vars"`, `"lh-root lh-vars lh-devtools"`)
			 .replace(`<title>Lighthouse Report`, `<title>DevTools Lighthouse Report`)


		const devtoolsFilePath = path.join(basePath, `${processID}.z.devtools.html`);
		fs.writeFileSync(devtoolsFilePath, devtoolshtml, {encoding: 'utf-8'});
	}

});
