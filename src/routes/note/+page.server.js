import { pool } from '$lib/server/db.js';

export async function load() {
    try {
        // Fetch all notes from your MySQL table
        const [rows] = await pool.execute('SELECT * FROM notes ORDER BY created_at DESC');
        
        console.log("Nota dijumpai:", rows.length); 

        return {
            notes: rows
        };
    } catch (err) {
        console.error("Ralat pangkalan data (Note):", err.message);
        return { notes: [] }; 
    }
}