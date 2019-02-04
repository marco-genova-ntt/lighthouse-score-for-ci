import { analyze } from './lighthouse-job';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env')});
analyze(['https://www.leroymerlin.it','https://www.leroymerlin.it/prodotti/specchi-bagno-CAT35-c']);