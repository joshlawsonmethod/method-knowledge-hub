import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { Actions } from './$types';

const {
	data: { user }
} = await supabase.auth.getUser();

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;

		const updates: { email?: string; password?: string; data?: { display_name: string } } = {};
		if (firstName && lastName && `${firstName} ${lastName}` !== user?.user_metadata.display_name)
			updates.data = { display_name: `${firstName} ${lastName}` };
		if (email && email.toLowerCase() !== user?.email?.toLowerCase()) updates.email = email;
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
