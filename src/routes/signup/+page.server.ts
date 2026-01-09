import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;

		if (!email || !password || !firstName || !lastName) {
			return fail(400, {
				error: 'All fields are required.',
				email
			});
		}

		const updates = {
			email,
			password,
			options: {
				data: {
					display_name: `${firstName} ${lastName}`,
					first_name: firstName,
					last_name: lastName
				}
			}
		};

		const { error } = await locals.supabase.auth.signUp(updates);

		if (error) {
			return fail(400, {
				error: error.message,
				email
			});
		}

		// Success! Redirect to dashboard or home
		throw redirect(303, '/dashboard');
	}
};
