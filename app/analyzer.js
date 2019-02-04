import lighthouse from 'lighthouse';
import ReportGenerator from 'lighthouse/lighthouse-core/report/report-generator';
import * as ChromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import * as utility from './utility';
import {uploadFile} from './aws-uploader';
import * as R from 'ramda';

/**
 * Default lighthouse manager to write result on the file system
 * 
 * @param {string} processID identifier of the analysis run
 * @param {*} results lighthouse results 
 */
export function defaultLighthouseManager(processID, results, chainManagers) {
  const html = ReportGenerator.generateReportHtml(results);
  const basePath = utility.getAbsolutePath(utility.string("REPORT_DIR", "./_reports"));
  const keyName = `${processID}.html`;
  const filePath = path.join(basePath, keyName);
  
  fs.writeFile(filePath, html, {encoding: 'utf-8'}, (err) => {
    if (err) throw err;
    
    if (utility.bool('AWS_S3_WRITING_ENABLED', false)) {
      const bucketName = utility.string('AWS_BUCKET_NAME');
      uploadFile(bucketName, keyName, filePath);
    }
    
  });

  if (utility.bool("REPORT_EXTRA_STYLE", false)) {
    const devtoolshtml = html
          .replace(`"lh-root lh-vars"`, `"lh-root lh-vars lh-devtools"`)
          .replace(`<title>Lighthouse Report`, `<title>DevTools Lighthouse Report`)

    const devtoolsFilePath = path.join(basePath, `${processID}.z.devtools.html`);
    fs.writeFileSync(devtoolsFilePath, devtoolshtml, {encoding: 'utf-8'});
  }

  if(chainManagers && R.length(chainManagers)) {
    const executeManager = x => R.call(x, processID, results);
    R.forEach(executeManager, chainManagers);
  }
}

/**
 * Lauches Chrome and lighthouse analysis phase
 * 
 * use results.lhr for the JS-consumeable output: @see https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
 * use results.report for the HTML/JSON/CSV output as a string
 * use results.artifacts for the trace/screenshots/other specific case you need (rarer)
 * chrome launcher docs: @see https://www.npmjs.com/package/chrome-launcher
 * config lighthouse ref: @see https://github.com/GoogleChrome/lighthouse/blob/888bd6dc9d927a734a8e20ea8a0248baa5b425ed/typings/externs.d.ts#L82-L119
 * lighthouse results: @see https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md
 * chrome configuration: @see https://github.com/GoogleChrome/lighthouse
 *  
 * @param {string} processID identifier of the analysis run
 * @param {*} pages web pages to analyze
 * @param {Array} customManagers custom managers for result management
 * @param {*} config lighhouse configuration
 */
export async function launchChrome(processID, pages, customManagers, config = null) {
  let opts = JSON.parse(fs.readFileSync(utility.getAbsolutePath( "./chrome_config.json"), 'utf8'));
  let chrome = await ChromeLauncher.launch({chromeFlags: opts.chromeFlags});

  console.log('chrome: %s', chrome.pid);
  opts.port = chrome.port;

  for (const page of pages) {
    let results = await lighthouse(page, opts, config);
    defaultLighthouseManager(processID, results.lhr, customManagers);
  }

  chrome.kill();
}
