<script lang="ts">
	// src/signup/+page.svelte
	import { supabase } from '$lib/supabaseClient.js';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';

	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';

	const signUpNewUser = async (event: SubmitEvent) => {
		event.preventDefault();
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: { display_name: `${firstName} ${lastName}` },
				emailRedirectTo: 'http://localhost:5173/auth/confirm'
			}
		});
	};
</script>

<main class="m-6 h-full w-full">
	<h1 class="mb-4 text-xl">Sign up for Method Knowledge Hub</h1>
	<form
		on:submit={signUpNewUser}
		class="flex w-1/2 flex-col gap-4 rounded-xl border-2 border-black p-6"
	>
		<div class="w-full">
			<Label class="block text-base" for="firstName">First Name</Label>
			<Input type="text" name="firstName" id="firstName" bind:value={firstName} />
		</div>
		<div class="w-full">
			<Label class="block text-base" for="lastName">Last Name</Label>
			<Input type="text" name="lastName" id="lastName" bind:value={lastName} />
		</div>
		<div class="w-full">
			<Label class="block text-base" for="email">Email</Label>
			<Input type="email" name="email" id="email" bind:value={email} />
		</div>
		<div class="w-full">
			<Label class="block" for="password">Password</Label>
			<Input type="password" name="password" id="password" bind:value={password} />
		</div>
		<Button class="" type="submit">Sign up!</Button>
	</form>
</main>
