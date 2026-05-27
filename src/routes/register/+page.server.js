import { pool } from '$lib/server/db.js';
import { fail, redirect, isRedirect } from '@sveltejs/kit';

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

        try {
            // Semak jika emel telah berdaftar
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

            // Tentukan peranan admin secara automatik semasa pendaftaran jika emel sepadan
            const assignedRole = (email === 'zamrinurdina@gmail.com') ? 'admin' : 'user';

            // Masukkan data pengguna baharu
            await pool.execute(
                `INSERT INTO users
                (fullname, email, password, role, points, badge, profile_image)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [fullname, email, password, assignedRole, 0, 'Rookie', 'default-avatar.png']
            );

            // Dapatkan semula ID pengguna yang baru didaftarkan
            const [newUserRows] = await pool.execute(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );

            if (newUserRows.length === 0 || !newUserRows[0].id) {
                throw new Error('Akaun berjaya dimasukkan tetapi ID pengguna gagal dikesan.');
            }

            const newUserId = newUserRows[0].id;

            // Tetapkan kuki sesi pengguna baharu
            cookies.set('session', String(newUserId), {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            });

            throw redirect(303, '/');

        } catch (error) {
            if (isRedirect(error)) {
                throw error;
            }
            console.error('Register Database Error:', error);
            return fail(500, {
                message: 'Ralat pangkalan data. Sila cuba mendaftar lagi.',
                error: true
            });
        }
    }
};