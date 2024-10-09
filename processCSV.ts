/**
 * Helper function for 'finalStore.ts'
    * Makes sure Column names match original csv data
        * follows SQLite column name conventions
    * Inserts data into DB with 100 rows at once
 */

import fs from 'fs';
import csv from 'csv-parser';
import knex from 'knex';

type DB = ReturnType<typeof knex>;

export const processCsv = (filePath: string, tableName: string, db: DB) => {
    return new Promise<void>((resolve, reject) => {
        const results: any[] = [];

        fs.createReadStream(filePath)
            .pipe(csv({
                // Map CSV headers to database column names
                mapHeaders: ({ header }) => {
                    switch (header.trim()) {
                        case 'Index': return 'id';
                        case 'Customer Id': return 'CustomerId';
                        case 'First Name': return 'FirstName';
                        case 'Last Name': return 'LastName';
                        case 'Phone 1': return 'Phone1';
                        case 'Phone 2': return 'Phone2';
                        case 'Subscription Date': return 'SubscriptionDate';
                        case 'Organization Id': return 'OrganizationId';
                        case 'Number of employees': return 'NumberOfEmployees';
                        default: return header.trim(); // Ensure no spaces
                    }
                }
            }))
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                // Batch insert data into the database
                const batchSize = 100; // Number of rows to insert per batch
                const batches = results.reduce((acc: any[][], item: any, index: number) => {
                    const batchIndex = Math.floor(index / batchSize);
                    if (!acc[batchIndex]) {
                    acc[batchIndex] = [];
                    }
                    acc[batchIndex].push(item);
                    return acc;
                }, []);
                await Promise.all(batches.map(batch => db(tableName).insert(batch)));
                console.log(`Data from ${filePath} inserted into ${tableName} successfully.`);
                resolve();
                } catch (error) {
                reject(error);
                }
            })
        .on('error', (error) => {
        reject(error);
        });
    });
};