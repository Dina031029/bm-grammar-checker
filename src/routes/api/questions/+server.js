import { pool } from '$lib/server/db.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const topicId = url.searchParams.get('topicId');
    
    if (!topicId) {
        return json({ error: 'Missing topic ID' }, { status: 400 });
    }

    try {
        const [questions] = await pool.execute(
            'SELECT * FROM questions WHERE topic_id = ?',
            [topicId]
        );
        return json(questions);
    } catch (err) {
        console.error("API Error:", err);
        return json({ error: 'Database error' }, { status: 500 });
    }
}