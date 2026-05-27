import { pool } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {

	const topicId = url.searchParams.get('topicId');

	try {

		const [questions] = await pool.execute(
			`
			SELECT
				id,
				question_text,
				option_a,
				option_b,
				option_c,
				option_d,
				correct_option,
				explanation
			FROM questions
			WHERE topic_id = ?
			ORDER BY RAND()
			`,
			[topicId]
		);

		return json(questions);

	} catch (err) {

		console.error('Error loading questions:', err);

		return json([]);
	}
}