import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export async function GET({ params }) {
    const { filename } = params;
    // Path to where your images are actually stored on your computer
    const filePath = path.join(process.cwd(), 'static', 'uploads', 'profile', filename);

    if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        return new Response(file);
    } else {
        throw error(404, 'Image not found');
    }
}