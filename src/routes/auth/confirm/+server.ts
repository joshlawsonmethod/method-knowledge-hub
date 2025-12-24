import { redirect } from '@sveltejs/kit';
import { type EmailOtpType } from '@supabase/supabase-js';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	console.log('[confirm] server hit', url.toString());
	const token_hash = url.searchParams.get('token_hash') as string;
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = url.searchParams.get('next') ?? '/dashboard';

	/**
	 * Clean up the redirect URL by deleting the Auth flow parameters.
	 *
	 * `next` is preserved for now, because it's needed in the error case.
	 */
	// const redirectTo = new URL(url);
	// redirectTo.pathname = next;
	// redirectTo.searchParams.delete('token_hash');
	// redirectTo.searchParams.delete('type');

	// if (token_hash && type) {
	// 	const { error } = await supabase.auth.verifyOtp({ token_hash, type });
	// 	if (!error) {
	// 		redirectTo.searchParams.delete('next');
	// 		redirect(303, redirectTo);
	// 	}
	// }

	if (!token_hash || !type) {
		console.log('[confirm] missing params');
		throw redirect(303, '/auth/error');
	}

	const { error } = await supabase.auth.verifyOtp({ token_hash, type });

	if (error) {
		// Keep next only if you truly need it for error UX; otherwise drop it too.
		console.log('[confirm] verifyOtp error', error.message);
		throw redirect(303, '/auth/error');
	}

	console.log('preparing to redirect');
	// return the user to an error page with some instructions
	// redirectTo.pathname = '/auth/error';
	const target = next.startsWith('/') ? next : '/dashboard';
	console.log('[confirm] success, redirecting to', target);
	throw redirect(303, target);
};
