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
type TxType = Parameters<Parameters<(typeof database)['transaction']>[0]>[0];
export type DatabaseConn = typeof database | TxType;

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
