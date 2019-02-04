import * as lfs from 'lighthouse-score-for-slack';
import * as utility from './utility';

export function dispatchMessageManager(processID = '000000', page = '', results) {

    if (results) {
        const performances = lfs.extractPerformanceValues(results);
        const author = utility.string ('AUTHOR', 'Lighthouse Score For Slack');
        const thumbUrl = utility.string ('THUMBURL', 'https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png');
		let template = utility.string('AWS_S3_TEMPLATE_RESOURCE');
        const linkToReport = utility.replace(template,'processID', processID);

        lfs.dispatchMessage(processID, author,performances.url, linkToReport, `analyzed: ${page}`, thumbUrl, performances.performance, 
            performances.accessibility, performances.bestpractices, performances.seo, performances.pwa);
    }

}