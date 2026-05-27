import { pool } from '$lib/server/db.js';

export async function load() {

	try {

		// GET ALL QUIZ TOPICS
		const [topics] = await pool.execute(`
			SELECT *
			FROM quiz_topics
			ORDER BY id DESC
		`);

		return {
			topics
		};

	} catch (err) {

		console.error('Error loading quiz topics:', err);

		return {
			topics: []
		};
	}
}