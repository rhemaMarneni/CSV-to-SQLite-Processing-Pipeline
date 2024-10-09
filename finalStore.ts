/**
 * Final step - storing csv data into tables
 * takes help of 'processCSV.ts'
 **/

import {processCsv} from './processCSV';
import path from 'path';
import knex from 'knex';

type DB = ReturnType<typeof knex>;

export const storeData = async (db: DB, outputDirectory: string): Promise<void> => {
    try {
        await new Promise<void>((resolve, reject) => {
            processCsv(path.join(outputDirectory, 'dump/customers.csv'), 'customers', db)
                .then(() => processCsv(path.join(outputDirectory, 'dump/organizations.csv'), 'organizations', db))
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    } catch (error) {
        console.error('Error processing CSV files:', error);
    } finally {
        await new Promise<void>((resolve, reject) => {
            db.destroy()
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    }
};