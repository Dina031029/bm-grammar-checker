import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.js',
	out: './drizzle',
	dialect: 'mysql',
	dbCredentials: {
		// We put the link directly here to bypass the .env error
		url: "mysql://root:@127.0.0.1:3306/melayu_db",
	},
});