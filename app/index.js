import { analyze } from './lighthouse-job';
import * as utility from './utility';
import {dispatchMessageManager} from './slack-emitter';
import {dispatchSeriesManager} from './allseries/series-manager';
import {downloadFile, checkExistence} from './aws-s3-manager';
import PagesProvider from './PagesProvider';

function startAnalisys(pages) {
    const customManagers = [dispatchMessageManager, dispatchSeriesManager];

    //XXX Imporve the design of acquiring database, adding a clear lifecycle 
    if(utility.bool('SERIES_SERVICE_DATABASE_FILE_ON_AWS')) {
        (async() => {
            const bucketName = utility.string('AWS_BUCKET_NAME');
            const dbPath = utility.string('SERIES_SERVICE_DATABASE_FILE', './tmp/database.json');
            const dbName = utility.extractFileName(dbPath);
            let existence = await checkExistence(bucketName, dbName);

            if (existence) {
                downloadFile(bucketName, dbName, dbPath, () => {
                    analyze(pages, customManagers);            
                });
            } else {
                analyze(pages, customManagers);
            }
        })();
    } else {
        analyze(pages, customManagers);
    }
}
//docker run -e "LIGHTHOUSE_CI_ENV=qa" lighthouse-slack-ci
const pagesProvider = new PagesProvider();

const context = utility.string('LIGHTHOUSE_CI_ENV', 'prod');
console.info('LightHouse CI - Environement [',context,']');
pagesProvider.loadPages();
pagesProvider.worksOnPages(context, startAnalisys);