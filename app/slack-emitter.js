import * as lfs from 'lighthouse-score-for-slack';
import * as utility from './utility';
import * as R from 'ramda';

export const hasScore = R.has('score');

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
export function dispatchMessage(idRunner, author, title, titleLink, internalText = '', thumbUrl = '', performance= 'NA', accessibility= 'NA', bestPractice= 'NA', seo= 'NA', pwa= 'NA') {
    const message = lfs.formatBaseMessage(idRunner);
    const attachments = lfs.formatBaseAttachment(author, title, titleLink, internalText, thumbUrl, performance, accessibility, bestPractice, seo, pwa);
    lfs.writeOnChat(message, attachments);
}

export function extractPerformanceValues (results) {
    return {
        performance: extractValue(results.categories, 'performance'),
        accessibility: extractValue(results.categories, 'accessibility'),
        bestpractices: extractValue(results.categories, 'best-practices'),
        seo: extractValue(results.categories, 'seo'),
        pwa: extractValue(results.categories, 'pwa'),
        url: results.finalUrl
    };
}

export function dispatchMessageManager(processID = '000000', results) {

    if (results) {
        const performances = extractPerformanceValues(results);
        console.log(performances);

        const author = utility.string ('AUTHOR', 'LSF Bot');
        const thumbUrl = utility.string ('THUMBURL', 'https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png');
        dispatchMessage(processID, author,performances.url,'undefined','', thumbUrl, performances.performance, 
            performances.accessibility, performances.bestpractices, performances.seo, performances.pwa);
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
export function extractValue (categories, idCategory) {
    const hasCategory = R.has(idCategory);
    
    if (categories && hasCategory(categories)) {
        const category = categories[idCategory];
        if (hasScore(category)) {
            return category.score * 100;
        }
    }

    return 'NA';
}