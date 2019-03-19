import { analyze } from './lighthouse-job';
import * as utility from './utility';
import {dispatchMessageManager} from './slack-emitter';
import {dispatchSeriesManager} from './allseries/series-manager';
import {downloadFile, checkExistence} from './aws-s3-manager';
import PagesProvider from './PagesProvider';
import process from 'process';

//XXX workaround to manage errors not caught, correct the behavior 
//when you see the trace in the log
process.on('uncaughtException', utility.manageGenericError); 
process.on('unhandledRejection', utility.manageGenericError);

/**
 * Starts analysis of the pages
 * 
 * @param {*} pages pages to analyze
 */
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

/**
 * Used to manage the download of 
 */
function mainProcess () {
    const pagesProvider = new PagesProvider();
    const context = utility.string('LIGHTHOUSE_CI_ENV', 'prod');
    console.info('LightHouse CI - Environement [',context,']');
    pagesProvider.loadPages();
    pagesProvider.worksOnPages(context, startAnalisys);
}

//XXX Create PromiseALL to retrive all files from repositories (eg AWS S3) then
//start the page analysis
//XXX improve a factory mode to manage local storage to support utility
if(utility.bool('AWS_S3_WRITING_ENABLED')) {
    (async() => {
        const bucketName = utility.string('AWS_BUCKET_NAME');
        const storagePath = utility.getAbsolutePath('.local_storage.json');
        const dbName = utility.extractFileName(storagePath);
        let existence = await checkExistence(bucketName, dbName);

        if (existence) {
            downloadFile(bucketName, dbName, storagePath, () => {
                utility.realoadStorageDatabase();
                mainProcess();            
            });
        } else {
            mainProcess();
        }
    })();
} else {
  mainProcess();
}