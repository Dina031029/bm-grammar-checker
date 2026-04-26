import { pool } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

/**
 * Helper function to determine the rank/badge based on user points.
 */
function getBadgeInfo(points) {
    if (points >= 1000) return { name: 'Pakar Tatabahasa', icon: '💎', color: '#7c3aed' };
    if (points >= 500)  return { name: 'Wira Bahasa', icon: '⚔️', color: '#2563eb' };
    if (points >= 200)  return { name: 'Pelajar Cemerlang', icon: '🌟', color: '#e11d48' };
    if (points >= 50)   return { name: 'Penjelajah Muda', icon: '🚀', color: '#059669' };
    return { name: 'Permulaan', icon: '🌱', color: '#64748b' };
}

export async function load({ cookies }) {
    const userId = cookies.get('session');
    
    if (!userId) throw redirect(303, '/login');

    try {
        const [rows] = await pool.execute(
            'SELECT id, fullname, email, password, points, profile_image, badge FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) throw redirect(303, '/login');

        const user = rows[0];
        const badgeInfo = getBadgeInfo(user.points || 0);

        // Update database if badge has changed
        if (user.badge !== badgeInfo.name) {
            await pool.execute('UPDATE users SET badge = ? WHERE id = ?', [badgeInfo.name, userId]);
        }

        return { 
            user: { 
                ...user, 
                badgeName: badgeInfo.name, 
                badgeIcon: badgeInfo.icon, 
                badgeColor: badgeInfo.color 
            } 
        };
    } catch (err) {
        console.error("Database Error:", err.message);
        throw redirect(303, '/login');
    }
}

export const actions = {
    updateProfile: async ({ request, cookies }) => {
        const userId = cookies.get('session');
        if (!userId) return fail(401, { message: 'Sesi tamat.' });

        const data = await request.formData();
        const fullname = data.get('fullname');
        const email = data.get('email');
        const password = data.get('password');
        const imageFile = data.get('profile_pic');

        let imageFileName = data.get('current_image') || 'default-avatar.png';

        if (imageFile && imageFile.size > 0) {
            try {
                const ext = path.extname(imageFile.name);
                const fileName = `user-${userId}-${Date.now()}${ext}`;
                const uploadDir = path.join(process.cwd(), 'static', 'uploads', 'profile');
                
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const arrayBuffer = await imageFile.arrayBuffer();
                fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(arrayBuffer));
                
                imageFileName = fileName;
                console.log("Image saved successfully to:", path.join(uploadDir, fileName));
            } catch (err) {
                console.error("File Upload Error:", err);
                return fail(500, { message: 'Gagal memuat naik imej.' });
            }
        }

        try {
            await pool.execute(
                'UPDATE users SET fullname = ?, email = ?, password = ?, profile_image = ? WHERE id = ?',
                [fullname, email, password, imageFileName, userId]
            );
            return { success: true, message: 'Profil berjaya dikemaskini!' };
        } catch (err) {
            return fail(500, { message: 'Ralat pangkalan data.' });
        }
    },

    deleteImage: async ({ cookies }) => {
        const userId = cookies.get('session');
        try {
            await pool.execute('UPDATE users SET profile_image = "default-avatar.png" WHERE id = ?', [userId]);
            return { success: true, message: 'Gambar dipadam.' };
        } catch (err) {
            return fail(500, { message: 'Gagal memadam gambar.' });
        }
    }
};