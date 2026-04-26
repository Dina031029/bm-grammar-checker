import { pool } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        try {
            // 1. Automatically elevate this specific account to Admin role
            if (email === 'zamrinurdina@gmail.com' && password === 'Admin1234') {
                await pool.execute(
                    "UPDATE users SET role = 'admin' WHERE email = ?",
                    [email]
                );
            }

            // 2. Validate credentials and retrieve ID and Role
            const [rows] = await pool.execute(
                'SELECT id, role FROM users WHERE email = ? AND password = ?',
                [email, password]
            );

            if (rows.length > 0) {
                const user = rows[0];

                // 3. Set the session cookie using the user ID [cite: 135]
                cookies.set('session', user.id, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 // 24 hours
                });

                // 4. Redirect to the homepage [cite: 138]
                // The sidebar will now react to the 'admin' role
                throw redirect(303, '/');
            } else {
                return fail(400, { message: 'Emel atau kata laluan salah.' });
            }
        } catch (err) {
            // Important: Re-throw redirects so SvelteKit can handle them [cite: 138]
            if (err.status === 303) throw err;
            
            console.error("Login Error:", err);
            return fail(500, { message: 'Ralat pelayan. Sila cuba lagi.' });
        }
    }
};