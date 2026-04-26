import { building } from '$app/environment';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	// 1. Temporarily Mock the user session so the app doesn't crash 
	// when it looks for event.locals.user
	event.locals.user = {
		id: "1",
		name: "Nurdina Zamri",
		email: "nurdina@example.com"
	};
	event.locals.session = { id: "mock-session" };

	// 2. Skip the svelteKitHandler for now to avoid the 500 error
	return resolve(event);
};