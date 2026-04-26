import { pool } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';

export async function load({ params }) {
    const [topic] = await pool.execute('SELECT * FROM quiz_topics WHERE id = ?', [params.id]);
    const [questions] = await pool.execute('SELECT * FROM questions WHERE topic_id = ?', [params.id]);
    
    return {
        topic: topic[0],
        questions
    };
}

export const actions = {
    addQuestion: async ({ request, params }) => {
        const data = await request.formData();
        const q_text = data.get('question_text');
        const a = data.get('opt_a');
        const b = data.get('opt_b');
        const c = data.get('opt_c');
        const d = data.get('opt_d');
        const correct = data.get('correct_option');

        try {
            await pool.execute(
                'INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [params.id, q_text, a, b, c, d, correct]
            );
            return { success: true };
        } catch (err) {
            return fail(500, { message: 'Gagal menambah soalan.' });
        }
    },
    deleteQuestion: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        await pool.execute('DELETE FROM questions WHERE id = ?', [id]);
        return { success: true };
    }
};