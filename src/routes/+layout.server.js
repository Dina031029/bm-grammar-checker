import { pool } from '$lib/server/db.js';

export async function load({ cookies, depends }) {
    // Menambah 'depends' membolehkan kita menyegarkan data ini secara manual jika perlu
    depends('app:user');
    
    const sessionId = cookies.get('session');

    if (sessionId) {
        try {
            // Ambil data terbaru termasuk points, badge, dan role [cite: 22]
            const [rows] = await pool.execute(
                'SELECT id, fullname, points, badge, role, profile_image FROM users WHERE id = ?',
                [sessionId]
            );

            if (rows.length > 0) {
                return { user: rows[0] };
            }
        } catch (error) {
            console.error("Layout Database Error:", error.message);
            return { user: null };
        }
    }
    return { user: null };
}