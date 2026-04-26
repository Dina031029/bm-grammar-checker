import { pool } from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

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

        // upload image to static folder
        if (imageFile && imageFile.size > 0) {
            const ext = path.extname(imageFile.name);
            const fileName = `user-${userId}-${Date.now()}${ext}`;
            const uploadDir = path.join(process.cwd(), 'static', 'uploads', 'profile');
            
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const arrayBuffer = await imageFile.arrayBuffer();
            fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(arrayBuffer));
            imageFileName = fileName;
        }

        try {
        
            await pool.execute(
                'UPDATE users SET fullname = ?, email = ?, password = ?, profile_image = ? WHERE id = ?',
                [fullname, email, password, imageFileName, userId]
            );
            return { success: true, message: 'Profil dan Navigasi berjaya dikemaskini!' };
        } catch (err) {
            return fail(500, { message: 'Ralat pangkalan data.' });
        }
    }
};