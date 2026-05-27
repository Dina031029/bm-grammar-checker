import { pool } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '$env/static/private';

// Initialize Cloudinary
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

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
        
        let imageUrl = data.get('current_image') || 'default-avatar.png';

        // Handle Image Upload to Cloudinary
        if (imageFile && imageFile.size > 0) {
            try {
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // Upload to Cloudinary
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ folder: 'profiles' }, (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }).end(buffer);
                });

                imageUrl = result.secure_url; // Save the URL, not the file name
            } catch (err) {
                console.error("Cloudinary Upload Error:", err);
                return fail(500, { message: 'Gagal memuat naik imej ke Cloudinary.' });
            }
        }

        try {
            await pool.execute(
                'UPDATE users SET fullname = ?, email = ?, password = ?, profile_image = ? WHERE id = ?',
                [fullname, email, password, imageUrl, userId]
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