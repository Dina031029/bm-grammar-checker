import { pool } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';

export async function load() {
    const [topics] = await pool.execute('SELECT * FROM quiz_topics ORDER BY id DESC');
    return { topics };
}

export const actions = {
    addTopic: async ({ request }) => {
        const formData = await request.formData();
        const title = formData.get('title');
        try {
            await pool.execute('INSERT INTO quiz_topics (title) VALUES (?)', [title]);
            return { success: true };
        } catch (err) {
            return fail(500, { message: 'Failed to create topic.' });
        }
    }
};