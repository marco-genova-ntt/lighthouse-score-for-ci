import { analyze } from './lighthouse-job';
import dotenv from 'dotenv';
import path from 'path';
import {dispatchMessageManager} from './slack-emitter';

dotenv.config({ path: path.join(process.cwd(), '.env')});
const customManagers = [dispatchMessageManager];
//analyze(['https://www.leroymerlin.it','https://www.leroymerlin.it/prodotti/specchi-bagno-CAT35-c'], customManagers);

analyze(['https://www.leroymerlin.it'], customManagers);