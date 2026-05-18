import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

const isTiDB = Number(env.DB_PORT) === 4000;

export const pool = mysql.createPool({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE,
	port: Number(env.DB_PORT) || 3306,

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