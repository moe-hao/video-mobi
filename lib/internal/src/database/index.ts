import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import config from '../config';
import { logger } from '../logger';

const pool = mysql.createPool({
    host: config.DatabaseHost,
    port: config.DatabasePort,
    user: config.DatabaseUsername,
    password: config.DatabasePassword,
    database: config.DatabaseName,
})

export const database = drizzle({ client: pool });
export type DatabaseConn = typeof database;

export async function connectDatabase() {
    const connection = await pool.getConnection();
    try {
        await connection.ping();
        logger.info('Database connected: Success!');
    } catch (error) {
        logger.error(`Database connection: Failed - ${error}`);
        throw error;
    } finally {
        connection.release();
    }
}
