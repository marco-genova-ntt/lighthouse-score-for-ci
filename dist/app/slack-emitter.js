"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatchMessage = dispatchMessage;
exports.extractPerformanceValues = extractPerformanceValues;
exports.dispatchMessageManager = dispatchMessageManager;
exports.extractValue = extractValue;
exports.hasScore = void 0;

var lfs = _interopRequireWildcard(require("lighthouse-score-for-slack"));

var utility = _interopRequireWildcard(require("./utility"));

var R = _interopRequireWildcard(require("ramda"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const hasScore = R.has('score');
/**
 * Dispatchs the request of slack message creation
 * 
 * @param {*} idRunner identifier of the run of analysis
 * @param {*} author author of post
 * @param {*} title title of attachment
 * @param {*} titleLink link of attachment
 * @param {*} internalText test in attachment card
 * @param {*} thumbUrl url of the image
 * @param {*} performance perfomance value in field
 * @param {*} accessibility assibility value in field
 * @param {*} bestPractice best practice value in field
 * @param {*} seo seo value in field
 * @param {*} pwa pwa value in field
 */

exports.hasScore = hasScore;

function dispatchMessage(idRunner, author, title, titleLink, internalText = '', thumbUrl = '', performance = 'NA', accessibility = 'NA', bestPractice = 'NA', seo = 'NA', pwa = 'NA') {
  const message = lfs.formatBaseMessage(idRunner);
  const attachments = lfs.formatBaseAttachment(author, title, titleLink, internalText, thumbUrl, performance, accessibility, bestPractice, seo, pwa);
  lfs.writeOnChat(message, attachments);
}

function extractPerformanceValues(results) {
  return {
    performance: extractValue(results.categories, 'performance'),
    accessibility: extractValue(results.categories, 'accessibility'),
    bestpractices: extractValue(results.categories, 'best-practices'),
    seo: extractValue(results.categories, 'seo'),
    pwa: extractValue(results.categories, 'pwa'),
    url: results.finalUrl
  };
}

function dispatchMessageManager(processID = '000000', results) {
  if (results) {
    const performances = extractPerformanceValues(results);
    console.log(performances);
    const author = utility.string('AUTHOR', 'LSF Bot');
    const thumbUrl = utility.string('THUMBURL', 'https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png');
    dispatchMessage(processID, author, performances.url, 'undefined', '', thumbUrl, performances.performance, performances.accessibility, performances.bestpractices, performances.seo, performances.pwa);
  }
}
/**
 * Gets score value of a category.
 * 
 * For the model of json object @see https://github.com/GoogleChrome/lighthouse/blob/master/docs/understanding-results.md
 * 
 * @param {*} categories all categories
 * @param {*} idCategory reference to category
 */


function extractValue(categories, idCategory) {
  const hasCategory = R.has(idCategory);

  if (categories && hasCategory(categories)) {
    const category = categories[idCategory];

    if (hasScore(category)) {
      return category.score * 100;
    }
  }

  return 'NA';
}