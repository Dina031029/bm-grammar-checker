import { pool } from '$lib/server/db.js';

export async function load() {
    try {
        // Fetch all quiz topics created by the admin
        const [topics] = await pool.execute('SELECT * FROM quiz_topics ORDER BY id DESC');
        
        return {
            topics: topics
        };
    } catch (err) {
        console.error("Error loading quizzes:", err);
        return { topics: [] };
    }
}