import { pool } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const fullname = data.get('fullname');
        const email = data.get('email');
        const password = data.get('password');
        const confirm = data.get('confirm');

        if (password !== confirm) {
            return fail(400, { message: 'Kata laluan tidak sepadan!', error: true });
        }

        try {
            const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                return fail(400, { message: 'Emel ini sudah berdaftar.', error: true });
            }

            await pool.execute(
                'INSERT INTO users (fullname, email, password, role, points, badge) VALUES (?, ?, ?, "user", 0, "Rookie")',
                [fullname, email, password]
            );
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Ralat pangkalan data. Sila cuba lagi.', error: true });
        }
        
        throw redirect(303, '/login');
    }
};