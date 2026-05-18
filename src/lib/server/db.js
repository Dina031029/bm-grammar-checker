import mysql from 'mysql2/promise';

import {
	DB_HOST,
	DB_USER,
	DB_PASSWORD,
	DB_DATABASE,
	DB_PORT,
	DB_CA
} from '$env/static/private';

const isTiDB = Number(DB_PORT) === 4000;

export const pool = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_DATABASE,
	port: Number(DB_PORT) || 3306,

	waitForConnections: true,
	connectionLimit: 5,
	queueLimit: 0,

	ssl: isTiDB
		? {
				ca: DB_CA,
				rejectUnauthorized: true,
				minVersion: 'TLSv1.2'
			}
		: undefined
});