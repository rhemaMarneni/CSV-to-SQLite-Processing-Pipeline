/**
 * Helper function to create sqlite tables
 * For easier testing purposes, drops existing tables in schema to generate new ones
 * All column are non-nullable and have auto-increment index
 */

import knex from "knex";
import config from "./knexfile";

const db = knex(config.development);

export const createTables = async (): Promise<void> => {
    try {
        console.log("Creating tables");

        // Drop tables if they exist
        await new Promise<void>((resolve, reject) => {
        db.schema.dropTableIfExists('customers')
            .then(() => db.schema.dropTableIfExists('organizations'))
            .then(() => resolve())
            .catch((error) => reject(error));
        });

        // Create 'customers' table
        await new Promise<void>((resolve, reject) => {
        db.schema.createTable('customers', (table) => {
            table.increments('id').primary();
            table.string('CustomerId').notNullable();
            table.string('FirstName').notNullable();
            table.string('LastName').notNullable();
            table.string('Company').notNullable();
            table.string('City').notNullable();
            table.string('Country').notNullable();
            table.string('Phone1').notNullable();
            table.string('Phone2').notNullable();
            table.string('Email').notNullable();
            table.dateTime('SubscriptionDate').notNullable();
            table.string('Website').notNullable();
        })
        .then(() => resolve())
        .catch((error) => reject(error));
        });

        // Create 'organizations' table
        await new Promise<void>((resolve, reject) => {
        db.schema.createTable('organizations', (table) => {
            table.increments('id').primary();
            table.string('OrganizationId').notNullable();
            table.string('Name').notNullable();
            table.string('Website').notNullable();
            table.string('Country').notNullable();
            table.text('Description').notNullable();
            table.dateTime('Founded').notNullable();
            table.string('Industry').notNullable();
            table.string('NumberOfEmployees').notNullable();
        })
        .then(() => resolve())
        .catch((error) => reject(error));
        });

        console.log("Tables created successfully");
    } catch (error) {
        console.error('Error creating Tables', error);
        throw error;
    } finally {
        await db.destroy();
    }
}