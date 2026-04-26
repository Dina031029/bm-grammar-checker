import { redirect } from '@sveltejs/kit';

export function load({ parent }) {
    // [cite: 137-138]
    const checkAccess = async () => {
        const { user } = await parent();
        if (!user || user.role !== 'admin') {
            throw redirect(303, '/'); // Send user back to the home page
        }
    };
    
    return checkAccess();
}