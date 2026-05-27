import { pool } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';

export async function load({ params }) {

	try {

		const [questions] = await pool.execute(
			'SELECT * FROM questions WHERE topic_id = ? ORDER BY id DESC',
			[params.id]
		);

		return {
			questions
		};

	} catch (err) {

		console.error(err);

		return {
			questions: []
		};
	}
}

export const actions = {

	addQuestion: async ({ request, params }) => {

		const data = await request.formData();

		const question_text = data.get('question_text');
		const option_a = data.get('option_a');
		const option_b = data.get('option_b');
		const option_c = data.get('option_c');
		const option_d = data.get('option_d');

		const correct_option = data.get('correct_option');

		const explanation = data.get('explanation');

		try {

			await pool.execute(
				`
				INSERT INTO questions
				(
					topic_id,
					question_text,
					option_a,
					option_b,
					option_c,
					option_d,
					correct_option,
					explanation
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)
				`,
				[
					params.id,
					question_text,
					option_a,
					option_b,
					option_c,
					option_d,
					correct_option,
					explanation
				]
			);

			return {
				success: true
			};

		} catch (err) {

			console.error('ADD QUESTION ERROR:', err);

			return fail(500, {
				message: 'Gagal tambah soalan'
			});
		}
	},

	updateQuestion: async ({ request }) => {

		const data = await request.formData();

		const id = data.get('id');

		const question_text = data.get('question_text');

		const option_a = data.get('option_a');
		const option_b = data.get('option_b');
		const option_c = data.get('option_c');
		const option_d = data.get('option_d');

		const correct_option = data.get('correct_option');

		const explanation = data.get('explanation');

		try {

			await pool.execute(
				`
				UPDATE questions
				SET
					question_text = ?,
					option_a = ?,
					option_b = ?,
					option_c = ?,
					option_d = ?,
					correct_option = ?,
					explanation = ?
				WHERE id = ?
				`,
				[
					question_text,
					option_a,
					option_b,
					option_c,
					option_d,
					correct_option,
					explanation,
					id
				]
			);

			return {
				success: true
			};

		} catch (err) {

			console.error('UPDATE ERROR:', err);

			return fail(500, {
				message: 'Gagal update soalan'
			});
		}
	},

	deleteQuestion: async ({ request }) => {

		const data = await request.formData();

		const id = data.get('id');

		try {

			await pool.execute(
				'DELETE FROM questions WHERE id = ?',
				[id]
			);

			return {
				success: true
			};

		} catch (err) {

			console.error('DELETE ERROR:', err);

			return fail(500, {
				message: 'Gagal padam soalan'
			});
		}
	}
};