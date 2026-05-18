import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE', 'DB_PORT'];

for (const key of requiredEnv) {
	if (!env[key]) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}

const isTiDB = Number(env.DB_PORT) === 4000;

export const pool = mysql.createPool({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE,
	port: Number(env.DB_PORT),

	waitForConnections: true,
	connectionLimit: 5,
	queueLimit: 0,

	ssl: isTiDB
		? {
				ca: env.DB_CA,
				rejectUnauthorized: true,
				minVersion: 'TLSv1.2'
			}
		: undefined
});