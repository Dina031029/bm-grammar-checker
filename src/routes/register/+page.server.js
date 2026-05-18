import { pool } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const fullname = data.get('fullname')?.toString().trim();
		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString();
		const confirm = data.get('confirm')?.toString();

		if (!fullname || !email || !password || !confirm) {
			return fail(400, {
				message: 'Sila lengkapkan semua maklumat.',
				error: true
			});
		}

		if (password !== confirm) {
			return fail(400, {
				message: 'Kata laluan tidak sepadan!',
				error: true
			});
		}

		let newUserId;

		try {
			const [existing] = await pool.execute(
				'SELECT id FROM users WHERE email = ?',
				[email]
			);

			if (existing.length > 0) {
				return fail(400, {
					message: 'Emel ini sudah berdaftar.',
					error: true
				});
			}

			const [result] = await pool.execute(
				`INSERT INTO users 
				(fullname, email, password, role, points, badge, profile_image)
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[
					fullname,
					email,
					password,
					'user',
					0,
					'Rookie',
					'default-avatar.png'
				]
			);

			newUserId = result.insertId;

			if (!newUserId) {
				throw new Error('User berjaya didaftarkan tetapi ID tidak dijana.');
			}

			cookies.set('session', String(newUserId), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});
		} catch (error) {
			console.error('Register Database Error:', {
				message: error.message,
				code: error.code,
				errno: error.errno,
				sqlMessage: error.sqlMessage
			});

			return fail(500, {
				message: 'Ralat pangkalan data. Sila cuba lagi.',
				error: true
			});
		}

		throw redirect(303, '/');
	}
};