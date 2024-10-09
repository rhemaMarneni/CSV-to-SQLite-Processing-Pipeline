/**
 * The entry point function. This will download the given dump file, extract/decompress it,
 * parse the CSVs within, and add the data to a SQLite database.
 * This is the core function
 */
import path from 'path';
import { fileURLToPath } from 'url';
import {DUMP_DOWNLOAD_URL} from './resources';
import knex from "knex";
import config from "./knexfile";
import { createTables } from './dbfile';
import {processInput} from './downloadInput';
import {storeData} from './finalStore';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function processDataDump() {
  const fileUrl: string = DUMP_DOWNLOAD_URL;
  //downloading file and storing it as 'downloaded_file.tar.gz' in tmp/
  const outputDirectory: string = path.join(__dirname, '/tmp');
  const outputFile: string = path.join(outputDirectory, 'downloaded_file.tar.gz')
  try {
    //Process input (download, decompress, extract)
    await processInput(fileUrl, outputDirectory, outputFile);
    console.log('Download and extraction process completed successfully');

    //Initialize Knex
    const db = knex(config.development);

    //Create tables in the database
    await createTables();
    console.log('Tables creation process completed.');

    //Process CSV files and store data in database
    await storeData(db, outputDirectory);
    console.log('Data processing completed.');

  } catch (error) {
    console.error('Error during process:', error);
  }
};