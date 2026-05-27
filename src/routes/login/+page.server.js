import { pool } from '$lib/server/db.js';
import { fail, redirect, isRedirect } from '@sveltejs/kit';

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
            // 1. Automatik jadikan akaun ini sebagai admin jika bertepatan
            if (email === 'zamrinurdina@gmail.com' && password === 'Admin1234') {
                await pool.execute(
                    "UPDATE users SET role = 'admin' WHERE email = ?",
                    [email]
                );
            }

            // 2. Semak padanan emel dan kata laluan
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

            // 3. Simpan id pengguna ke dalam kuki sesi
            cookies.set('session', String(user.id), {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            });

            // 4. Alihkan pengguna ke halaman utama (Wajib dilempar keluar dari try-catch dengan selamat)
            throw redirect(303, '/');

        } catch (err) {
            // JIKA ralat adalah jenis redirect daripada SvelteKit, teruskan proses peralihan halaman
            if (isRedirect(err)) {
                throw err;
            }

            console.error('Login Server Error:', err);
            return fail(500, {
                message: 'Ralat pelayan dalaman. Sila cuba lagi sebentar.'
            });
        }
    }
};