import { pool } from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const DEFAULT_PROFILE_IMAGE = 'default-avatar.png';

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSafeImageExtension(file) {
	const ext = path.extname(file.name).toLowerCase();

	const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

	if (!allowedExtensions.includes(ext)) {
		return null;
	}

	return ext;
}

async function saveProfileImage(imageFile, userId) {
	if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
		throw new Error('INVALID_IMAGE_TYPE');
	}

	if (imageFile.size > MAX_IMAGE_SIZE) {
		throw new Error('IMAGE_TOO_LARGE');
	}

	const ext = getSafeImageExtension(imageFile);

	if (!ext) {
		throw new Error('INVALID_IMAGE_EXTENSION');
	}

	const fileName = `user-${userId}-${Date.now()}${ext}`;
	const uploadDir = path.join(process.cwd(), 'static', 'uploads', 'profile');
	const filePath = path.join(uploadDir, fileName);

	await fs.mkdir(uploadDir, { recursive: true });

	const arrayBuffer = await imageFile.arrayBuffer();
	await fs.writeFile(filePath, Buffer.from(arrayBuffer));

	return fileName;
}

export const actions = {
	updateProfile: async ({ request, cookies }) => {
		const userId = cookies.get('session');

		if (!userId) {
			return fail(401, {
				message: 'Sesi tamat. Sila log masuk semula.'
			});
		}

		const data = await request.formData();

		const fullname = String(data.get('fullname') || '').trim();
		const email = String(data.get('email') || '').trim().toLowerCase();
		const password = String(data.get('password') || '').trim();
		const imageFile = data.get('profile_pic');

		let imageFileName = String(data.get('current_image') || DEFAULT_PROFILE_IMAGE);

		if (!fullname || !email) {
			return fail(400, {
				message: 'Nama penuh dan emel diperlukan.'
			});
		}

		if (!isValidEmail(email)) {
			return fail(400, {
				message: 'Format emel tidak sah.'
			});
		}

		if (password && password.length < 6) {
			return fail(400, {
				message: 'Kata laluan mesti sekurang-kurangnya 6 aksara.'
			});
		}

		try {
			if (imageFile instanceof File && imageFile.size > 0) {
				imageFileName = await saveProfileImage(imageFile, userId);
			}

			if (password) {
				const hashedPassword = await bcrypt.hash(password, 10);

				await pool.execute(
					`
					UPDATE users
					SET fullname = ?, email = ?, password = ?, profile_image = ?
					WHERE id = ?
					`,
					[fullname, email, hashedPassword, imageFileName, userId]
				);
			} else {
				await pool.execute(
					`
					UPDATE users
					SET fullname = ?, email = ?, profile_image = ?
					WHERE id = ?
					`,
					[fullname, email, imageFileName, userId]
				);
			}

			return {
				success: true,
				message: 'Profil berjaya dikemaskini!'
			};
		} catch (err) {
			console.error('Update profile error:', err);

			if (err.message === 'INVALID_IMAGE_TYPE') {
				return fail(400, {
					message: 'Hanya gambar berformat JPG, PNG atau WEBP dibenarkan.'
				});
			}

			if (err.message === 'IMAGE_TOO_LARGE') {
				return fail(400, {
					message: 'Saiz gambar maksimum ialah 2MB.'
				});
			}

			if (err.message === 'INVALID_IMAGE_EXTENSION') {
				return fail(400, {
					message: 'Extension gambar tidak sah.'
				});
			}

			if (err.code === 'ER_DUP_ENTRY') {
				return fail(400, {
					message: 'Emel ini sudah digunakan oleh pengguna lain.'
				});
			}

			return fail(500, {
				message: 'Ralat pangkalan data.'
			});
		}
	}
};