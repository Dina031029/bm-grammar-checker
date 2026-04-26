import { pool } from '$lib/server/db.js';

export async function load() {
    const [students] = await pool.execute(
        'SELECT fullname, email, points, badge, profile_image FROM users WHERE role = "user" ORDER BY points DESC'
    );
    return { students };
}import { pool } from '$lib/server/db.js';

export async function load() {
    // Fetch all users with the 'user' role, ordered by highest points 
    const [students] = await pool.execute(
        'SELECT fullname, email, points, badge, profile_image FROM users WHERE role = "user" ORDER BY points DESC'
    );
    return { students };
}