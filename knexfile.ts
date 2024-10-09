/** To set up sqlite using knex
    * create out/ directory
    * setup config
**/

import type { Knex } from "knex";
import {SQLITE_DB_PATH} from "./resources";
import {createDirectory} from "./downloadInput";
import path from 'path';
import { fileURLToPath } from 'url';

try{
    //create /out directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outDirectory: string = path.join(__dirname, '/out');
    createDirectory(outDirectory);
} catch (err){
    console.error("Output directory could not be created: ", err);
}

//setup config
const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: SQLITE_DB_PATH
        },
        useNullAsDefault: true
    }
};

export default config;