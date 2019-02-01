import lighthouse from 'lighthouse';
import ReportGenerator from 'lighthouse/lighthouse-core/report/report-generator';
import * as ChromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import * as utility from './utility';

/**
 * Lauches Chrome and lighhouse analysis phase
 * 
 * use results.lhr for the JS-consumeable output: @see https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
 * use results.report for the HTML/JSON/CSV output as a string
 * use results.artifacts for the trace/screenshots/other specific case you need (rarer)
 * chrome launcher docs: @see https://www.npmjs.com/package/chrome-launcher
 * config lighthouse ref: @see https://github.com/GoogleChrome/lighthouse/blob/888bd6dc9d927a734a8e20ea8a0248baa5b425ed/typings/externs.d.ts#L82-L119
 * lighthouse results: @see https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md
 * chrome configuration: @see https://github.com/GoogleChrome/lighthouse
 * 
 * @param {*} url url to analyze
 * @param {*} opts chrome options
 * @param {*} config lighthouse configuration
 */
export function launchChromeAndRunLighthouse(url, config = null, resultManager) {
  let opts = JSON.parse(fs.readFileSync(utility.getAbsolutePath( "./chrome_config.json"), 'utf8'));

  return ChromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr).catch((err) => console.error("error during analysis phase: %s", err.message));
    }).catch((err) => console.error("error during lighthouse execution: %s", err.message));
  });
}

/**
 * Default lighthouse manager to write result on the file system
 * 
 * @param {*} results lighthouse results 
 */
export function defaultLighthouseManager(results) {
  // Use results
  const html = ReportGenerator.generateReportHtml(results);
  const basePath = utility.getAbsolutePath(utility.string("REPORT_DIR", "./_reports"));
  const processID = utility.getProgressiveCounter();
  const filePath = path.join(basePath, `${processID}.html`);
  
  fs.writeFileSync(filePath, html, {encoding: 'utf-8'});

  if (utility.bool("REPORT_EXTRA_STYLE", false)) {
      // Create Devtools report that's denser
      // TODO: add in extra styles that devtools manually injects

      const devtoolshtml = html
              .replace(`"lh-root lh-vars"`, `"lh-root lh-vars lh-devtools"`)
              .replace(`<title>Lighthouse Report`, `<title>DevTools Lighthouse Report`)

      const devtoolsFilePath = path.join(basePath, `${processID}.z.devtools.html`);
      fs.writeFileSync(devtoolsFilePath, devtoolshtml, {encoding: 'utf-8'});
  }
}