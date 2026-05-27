import { pool } from '$lib/server/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    try {
        // Hanya memuatkan data dari TiDB untuk dibaca oleh pengguna biasa/pelajar
        const [notes] = await pool.execute('SELECT * FROM notes ORDER BY created_at DESC');
        return { notes };
    } catch (err) {
        console.error("Gagal memuatkan nota:", err);
        return { notes: [] };
    }
}
