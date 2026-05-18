import { pool } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, {
				message: 'Sila masukkan emel dan kata laluan.'
			});
		}

		try {
			// 1. Automatically make this specific account admin
			if (email === 'zamrinurdina@gmail.com' && password === 'Admin1234') {
				await pool.execute(
					"UPDATE users SET role = 'admin' WHERE email = ?",
					[email]
				);
			}

			// 2. Check email and password
			const [rows] = await pool.execute(
				`SELECT id, fullname, email, role, points, badge, profile_image
				 FROM users
				 WHERE email = ? AND password = ?`,
				[email, password]
			);

			if (rows.length === 0) {
				return fail(400, {
					message: 'Emel atau kata laluan salah.'
				});
			}

			const user = rows[0];

			// 3. Save user id inside session cookie
			cookies.set('session', String(user.id), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});

			// 4. Redirect to homepage
			throw redirect(303, '/');
		} catch (err) {
			if (err.status === 303) {
				throw err;
			}

			console.error('Login Error:', {
				message: err.message,
				code: err.code,
				sqlMessage: err.sqlMessage
			});

			return fail(500, {
				message: 'Ralat pelayan. Sila cuba lagi.'
			});
		}
	}
};