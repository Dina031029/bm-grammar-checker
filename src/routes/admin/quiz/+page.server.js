import { pool } from '$lib/server/db.js';
export async function load() {
    const [topics] = await pool.execute('SELECT * FROM quiz_topics');
    return { topics };
}
export const actions = {
    createTopic: async ({ request }) => {
        const title = (await request.formData()).get('title');
        await pool.execute('INSERT INTO quiz_topics (title) VALUES (?)', [title]);
    },
    deleteTopic: async ({ request }) => {
        const id = (await request.formData()).get('id');
        await pool.execute('DELETE FROM questions WHERE topic_id = ?', [id]);
        await pool.execute('DELETE FROM quiz_topics WHERE id = ?', [id]);
    }
};