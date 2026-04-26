import { pool } from '$lib/server/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    try {
        // Fetch all users with the 'user' role, ordered by highest points 
        const [students] = await pool.execute(
            'SELECT fullname, email, points, badge, profile_image FROM users WHERE role = "user" ORDER BY points DESC'
        );

        return { 
            students 
        };
    } catch (error) {
        console.error("Database Error:", error);
        return { 
            students: [] 
        };
    }
}