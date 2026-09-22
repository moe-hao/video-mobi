import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { logger } from './logger';
import { config } from './config';

const pool = mysql.createPool({
    host: config.DatabaseHost,
    port: config.DatabasePort,
    user: config.DatabaseUsername,
    password: config.DatabasePassword,
    database: config.DatabaseName,
});

pool.on('connection', () => {
    logger.info("Database connected: Success!");
});

const connection = await pool.getConnection();
await connection.ping();

export const database = drizzle({ client: pool });

type TxType = Parameters<Parameters<(typeof database)['transaction']>[0]>[0];
export type DatabaseConn = typeof database | TxType;
