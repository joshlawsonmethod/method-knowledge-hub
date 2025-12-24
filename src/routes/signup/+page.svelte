<script lang="ts">
	// src/signup/+page.svelte
	import { supabase } from '$lib/supabaseClient.js';

	let email = '';
	let password = '';

	const signUpNewUser = async (event: SubmitEvent) => {
		event.preventDefault();
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				emailRedirectTo: 'http://localhost:5173/auth/confirm'
			}
		});
	};
</script>

<section class="h-full w-full m-6">
	<h1 class="text-xl mb-4">Sign up for Method Knowledge Hub</h1>
	<form
		on:submit={signUpNewUser}
		class="w-1/2 border-2 rounded-xl border-black p-6 flex flex-col gap-4"
	>
		<div class="w-full">
			<label class="text-base block" for="email"> Email </label>
			<input
				class="block border rounded-lg border-black p-2 w-full"
				type="email"
				name="email"
				id="email"
				bind:value={email}
			/>
		</div>
		<div class="w-full">
			<label class="block" for="password"> Password </label>
			<input
				class="block border rounded-lg border-black p-2 w-full"
				type="password"
				name="password"
				id="password"
				bind:value={password}
			/>
		</div>
		<button class="p-2 bg-black text-white rounded-lg cursor-pointer" type="submit">Sign up!</button
		>
	</form>
</section>
