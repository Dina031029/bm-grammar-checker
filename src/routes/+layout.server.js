import { pool } from '$lib/server/db.js';

export async function load({ cookies, depends }) {
	depends('app:user');

	const sessionId = cookies.get('session');

	if (!sessionId) {
		return { user: null };
	}

	try {
		const [rows] = await pool.execute(
			`SELECT id, fullname, points, badge, role, profile_image
			 FROM users
			 WHERE id = ?`,
			[sessionId]
		);

		if (rows.length > 0) {
			return {
				user: rows[0]
			};
		}

		return { user: null };
	} catch (error) {
		console.error('Layout Database Error:', {
			message: error.message,
			code: error.code,
			sqlMessage: error.sqlMessage
		});

		return { user: null };
	}
}