import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (user) {
		redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;

		const updates: { email?: string; password?: string; data?: { display_name: string } } = {};
		if (
			firstName &&
			lastName &&
			`${firstName} ${lastName}` !== locals.user?.user_metadata.display_name
		)
			updates.data = { display_name: `${firstName} ${lastName}` };
		if (email && email.toLowerCase() !== locals.user?.email?.toLowerCase()) updates.email = email;
		if (password) updates.password = password;

		const { error } = await locals.supabase.auth.updateUser(updates);

		if (error) {
			return fail(400, {
				error: error.message,
				email
			});
		}
	}
};
