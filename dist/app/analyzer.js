"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.launchChromeAndRunLighthouse = launchChromeAndRunLighthouse;
exports.defaultLighthouseManager = defaultLighthouseManager;

var _lighthouse = _interopRequireDefault(require("lighthouse"));

var _reportGenerator = _interopRequireDefault(require("lighthouse/lighthouse-core/report/report-generator"));

var ChromeLauncher = _interopRequireWildcard(require("chrome-launcher"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var utility = _interopRequireWildcard(require("./utility"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function launchChromeAndRunLighthouse(url, config = null, resultManager) {
  let opts = JSON.parse(_fs.default.readFileSync(utility.getAbsolutePath("./chrome_config.json"), 'utf8'));
  return ChromeLauncher.launch({
    chromeFlags: opts.chromeFlags
  }).then(chrome => {
    opts.port = chrome.port;
    return (0, _lighthouse.default)(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr).catch(err => console.error("error during analysis phase: %s, [STACK] %s", err.message, err.stack));
    }).catch(err => console.error("error during lighthouse execution: %s, [STACK] %s", err.message, err.stack));
  });
}
/**
 * Default lighthouse manager to write result on the file system
 * 
 * @param {*} results lighthouse results 
 */


function defaultLighthouseManager(results) {
  // Use results
  const html = _reportGenerator.default.generateReportHtml(results);

  const basePath = utility.getAbsolutePath(utility.string("REPORT_DIR", "./_reports"));
  const processID = utility.getProgressiveCounter();

  const filePath = _path.default.join(basePath, `${processID}.html`);

  _fs.default.writeFileSync(filePath, html, {
    encoding: 'utf-8'
  });

  if (utility.bool("REPORT_EXTRA_STYLE", false)) {
    // Create Devtools report that's denser
    // TODO: add in extra styles that devtools manually injects
    const devtoolshtml = html.replace(`"lh-root lh-vars"`, `"lh-root lh-vars lh-devtools"`).replace(`<title>Lighthouse Report`, `<title>DevTools Lighthouse Report`);

    const devtoolsFilePath = _path.default.join(basePath, `${processID}.z.devtools.html`);

    _fs.default.writeFileSync(devtoolsFilePath, devtoolshtml, {
      encoding: 'utf-8'
    });
  }
}