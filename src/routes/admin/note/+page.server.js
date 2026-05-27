import { pool } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';
import cloudinary from '$lib/server/cloudinary.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {

	try {

		const [notes] = await pool.execute(
			'SELECT * FROM notes ORDER BY created_at DESC'
		);

		return { notes };

	} catch (err) {

		console.error(err);

		return { notes: [] };
	}
}

async function uploadToCloudinary(file, folder = 'melayu-checker') {

	if (!file || file.size === 0) return null;

	const bytes = await file.arrayBuffer();

	const buffer = Buffer.from(bytes);

	return new Promise((resolve, reject) => {

		cloudinary.uploader.upload_stream(
			{
				resource_type: 'auto',
				folder
			},
			(error, result) => {

				if (error) reject(error);
				else resolve(result);
			}
		).end(buffer);
	});
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

		if (!title || !category) {

			return fail(400, {
				error: true,
				message: 'Tajuk dan kategori wajib diisi.'
			});
		}

		let pdfUrl = data.get('current_pdf_url') || '';

		let coverUrl =
			data.get('current_cover_url') ||
			'/default-note.png';

		try {

			// PDF upload
			if (pdfFile && pdfFile.size > 0) {

				const pdfUpload = await uploadToCloudinary(
					pdfFile,
					'melayu-checker/pdfs'
				);

				pdfUrl = pdfUpload.secure_url;
			}

			// Cover upload
			if (coverFile && coverFile.size > 0) {

				const imageUpload = await uploadToCloudinary(
					coverFile,
					'melayu-checker/covers'
				);

				coverUrl = imageUpload.secure_url;
			}

			// UPDATE
			if (id) {

				await pool.execute(
					`
					UPDATE notes
					SET
						title = ?,
						category = ?,
						file_url = ?,
						cover_image = ?
					WHERE id = ?
					`,
					[
						title,
						category,
						pdfUrl,
						coverUrl,
						id
					]
				);

				return {
					success: true,
					message: 'Nota berjaya dikemaskini!'
				};
			}

			// INSERT
			else {

				if (!pdfUrl) {

					return fail(400, {
						error: true,
						message:
							'Fail PDF wajib dimuat naik.'
					});
				}

				await pool.execute(
					`
					INSERT INTO notes
					(
						title,
						category,
						file_url,
						cover_image
					)
					VALUES (?, ?, ?, ?)
					`,
					[
						title,
						category,
						pdfUrl,
						coverUrl
					]
				);

				return {
					success: true,
					message: 'Nota berjaya ditambah!'
				};
			}
		}

		catch (err) {

			console.error('UPLOAD ERROR:', err);

			return fail(500, {
				error: true,
				message:
					'Ralat berlaku semasa upload nota.'
			});
		}
	},

	deleteNote: async ({ request }) => {

		const data = await request.formData();

		const id = data.get('id');

		if (!id) {

			return fail(400, {
				error: true,
				message: 'ID tidak sah.'
			});
		}

		try {

			await pool.execute(
				'DELETE FROM notes WHERE id = ?',
				[id]
			);

			return {
				success: true,
				message: 'Nota berjaya dipadam.'
			};
		}

		catch (err) {

			console.error(err);

			return fail(500, {
				error: true,
				message: 'Gagal memadam nota.'
			});
		}
	}
};