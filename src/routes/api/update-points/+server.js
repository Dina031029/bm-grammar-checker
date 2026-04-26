import { pool } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const userId = cookies.get('session');
    const { points } = await request.json();

    if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // Tambah mata baru kepada mata sedia ada
        await pool.execute(
            'UPDATE users SET points = points + ? WHERE id = ?',
            [points, userId]
        );
        return json({ success: true });
    } catch (err) {
        console.error('Failed to update points:', err);
        return json({ error: 'Database error' }, { status: 500 });
    }
}