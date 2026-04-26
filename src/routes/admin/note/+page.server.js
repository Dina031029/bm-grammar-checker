import { pool } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export async function load() {
    const [notes] = await pool.execute('SELECT * FROM notes ORDER BY created_at DESC');
    return { notes };
}

export const actions = {
    manageNote: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id'); // Jika ada ID, kita sedang 'Edit'
        const title = data.get('title');
        const category = data.get('category');
        const pdfFile = data.get('note_pdf');
        const coverFile = data.get('cover_image');

        let pdfUrl = data.get('current_pdf_url');
        let coverUrl = data.get('current_cover_url') || 'default-note.png';

        const uploadDir = path.join(process.cwd(), 'static', 'uploads', 'notes');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        // Proses muat naik fail PDF
        if (pdfFile && pdfFile.size > 0) {
            const pdfName = `note-${Date.now()}-${pdfFile.name}`;
            const pdfBuffer = await pdfFile.arrayBuffer();
            fs.writeFileSync(path.join(uploadDir, pdfName), Buffer.from(pdfBuffer));
            pdfUrl = `/uploads/notes/${pdfName}`;
        }

        // Proses muat naik fail Imej Cover
        if (coverFile && coverFile.size > 0) {
            const coverName = `cover-${Date.now()}-${coverFile.name}`;
            const coverBuffer = await coverFile.arrayBuffer();
            fs.writeFileSync(path.join(uploadDir, coverName), Buffer.from(coverBuffer));
            coverUrl = coverName;
        }

        try {
            if (id) {
                // UPDATE (Edit)
                await pool.execute(
                    'UPDATE notes SET title = ?, category = ?, file_url = ?, cover_image = ? WHERE id = ?',
                    [title, category, pdfUrl, coverUrl, id]
                );
            } else {
                // INSERT (Add)
                await pool.execute(
                    'INSERT INTO notes (title, category, file_url, cover_image) VALUES (?, ?, ?, ?)',
                    [title, category, pdfUrl, coverUrl]
                );
            }
            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Ralat pangkalan data.' });
        }
    },

    deleteNote: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        try {
            await pool.execute('DELETE FROM notes WHERE id = ?', [id]);
            return { success: true };
        } catch (err) {
            return fail(500, { message: 'Gagal memadam nota.' });
        }
    }
};