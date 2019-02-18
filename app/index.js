import { analyze } from './lighthouse-job';
import * as utility from './utility';
import fs from 'fs';
import path from 'path';
import {dispatchMessageManager} from './slack-emitter';
import {dispatchSeriesManager} from './allseries/series-manager';
import {downloadFile, checkExistence} from './aws-s3-manager';

fs.readFile(path.join(process.cwd(), 'pages.json'), (err, data) => {
    if (err) throw err;
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
                    analyze(JSON.parse(data), customManagers);            
                });
            } else {
                analyze(JSON.parse(data), customManagers);
            }
        })();
    } else {
        analyze(JSON.parse(data), customManagers);
    }
});

