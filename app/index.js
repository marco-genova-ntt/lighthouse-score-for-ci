import { analyze } from './lighthouse-job';
import fs from 'fs';
import path from 'path';
import {dispatchMessageManager} from './slack-emitter';


fs.readFile(path.join(process.cwd(), 'pages.json'), (err, data) => {
    if (err) throw err;

    const customManagers = [dispatchMessageManager];
    analyze(JSON.parse(data), customManagers);
});

