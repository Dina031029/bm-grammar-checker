import { pool } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'static', 'uploads', 'notes');

/**
 * Fungsi bantuan untuk memadam fail fizikal dari folder static secara selamat
 */
function hapusFailFizikal(namaAtauUrl, isFullUrl = false) {
    try {
        let namaFail = namaAtauUrl;
        if (isFullUrl && namaAtauUrl) {
            // Tukar dari "/uploads/notes/fail.pdf" kepada "fail.pdf"
            namaFail = namaAtauUrl.replace('/uploads/notes/', '');
        }
        
        if (namaFail && namaFail !== 'default-note.png') {
            const laluanFail = path.join(UPLOAD_DIR, namaFail);
            if (fs.existsSync(laluanFail)) {
                fs.unlinkSync(laluanFail);
            }
        }
    } catch (ralat) {
        console.error('Gagal memadam fail fizikal terbiar:', ralat);
    }
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    try {
        const [notes] = await pool.execute('SELECT * FROM notes ORDER BY created_at DESC');
        return { notes };
    } catch (err) {
        console.error('Ralat ketika memuatkan nota:', err);
        return { notes: [] };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    manageNote: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id'); 
        const title = data.get('title')?.toString().trim();
        const category = data.get('category')?.toString().trim();
        const pdfFile = data.get('note_pdf');
        const coverFile = data.get('cover_image');

        // Pengesahan input wajib
        if (!title || !category) {
            return fail(400, { error: true, message: 'Tajuk dan kategori wajib diisi.' });
        }

        let pdfUrl = data.get('current_pdf_url') || '';
        let coverUrl = data.get('current_cover_url') || 'default-note.png';

        // Pastikan folder uploads wujud
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        // 1. Proses Muat Naik Fail PDF
        if (pdfFile && pdfFile.size > 0 && pdfFile instanceof File) {
            // Jika mod Edit, buang fail PDF lama terlebih dahulu
            if (id && pdfUrl) hapusFailFizikal(pdfUrl, true);

            const namaPdfBersih = `note-${Date.now()}-${pdfFile.name.replace(/\s+/g, '_')}`;
            const pdfBuffer = await pdfFile.arrayBuffer();
            fs.writeFileSync(path.join(UPLOAD_DIR, namaPdfBersih), Buffer.from(pdfBuffer));
            pdfUrl = `/uploads/notes/${namaPdfBersih}`;
        }

        // 2. Proses Muat Naik Imej Kulit (Cover)
        if (coverFile && coverFile.size > 0 && coverFile instanceof File) {
            // Jika mod Edit, buang imej lama terlebih dahulu (kecuali imej default)
            if (id && coverUrl && coverUrl !== 'default-note.png') {
                hapusFailFizikal(coverUrl, false);
            }

            const namaCoverBersih = `cover-${Date.now()}-${coverFile.name.replace(/\s+/g, '_')}`;
            const coverBuffer = await coverFile.arrayBuffer();
            fs.writeFileSync(path.join(UPLOAD_DIR, namaCoverBersih), Buffer.from(coverBuffer));
            coverUrl = namaCoverBersih;
        }

        try {
            if (id) {
                // OPERASI KEMASKINI (EDIT)
                await pool.execute(
                    'UPDATE notes SET title = ?, category = ?, file_url = ?, cover_image = ? WHERE id = ?',
                    [title, category, pdfUrl, coverUrl, id]
                );
                return { success: true, message: 'Nota berjaya dikemaskini!' };
            } else {
                // OPERASI TAMBAH BARU (INSERT)
                if (!pdfFile || pdfFile.size === 0) {
                    return fail(400, { error: true, message: 'Fail PDF wajib dimuat naik untuk nota baharu.' });
                }
                await pool.execute(
                    'INSERT INTO notes (title, category, file_url, cover_image) VALUES (?, ?, ?, ?)',
                    [title, category, pdfUrl, coverUrl]
                );
                return { success: true, message: 'Nota baharu berjaya ditambahkan!' };
            }
        } catch (err) {
            console.error(err);
            return fail(500, { error: true, message: 'Ralat pangkalan data berlaku.' });
        }
    },

    deleteNote: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');

        if (!id) return fail(400, { error: true, message: 'ID nota tidak sah.' });

        try {
            // Ambil nama fail dari DB sebelum rekod dipadamkan
            const [rows] = await pool.execute('SELECT file_url, cover_image FROM notes WHERE id = ?', [id]);
            if (rows.length > 0) {
                hapusFailFizikal(rows[0].file_url, true);
                hapusFailFizikal(rows[0].cover_image, false);
            }

            await pool.execute('DELETE FROM notes WHERE id = ?', [id]);
            return { success: true, message: 'Nota dan fail berkaitan berjaya dipadam sepenuhnya.' };
        } catch (err) {
            console.error(err);
            return fail(500, { error: true, message: 'Gagal memadam nota daripada sistem.' });
        }
    }
};