import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
	schema: './src/lib/server/db/schema.js',
	out: './drizzle',
	dialect: 'mysql',
	dbCredentials: {
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT) || 4000,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		ssl: process.env.DB_CA
			? {
					ca: process.env.DB_CA
				}
			: undefined
	}
});