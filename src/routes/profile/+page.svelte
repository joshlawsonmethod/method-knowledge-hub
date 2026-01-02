<script lang="ts">
	// profile/+page.svelte
	import { supabase } from '$lib/supabaseClient';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Button from '$lib/components/Button.svelte';

	import { CircleUser } from '@lucide/svelte';
	import type { ActionData, PageData } from '../$types';
	import { enhance } from '$app/forms';

	let firstName = $state('');
	let lastName = $state('');
	let hideNameFields = $state(true);
	let hidePasswordField = $state(true);
	let hideEmailField = $state(true);

	let { data }: { data: PageData; form: ActionData } = $props();
	const user = $derived(data.session?.user);
</script>

<main class="my-6 flex flex-col items-center justify-center">
	<section class="mb-7 flex flex-col items-center justify-center gap-2">
		<h1 class="text-center text-3xl font-semibold">Your Profile</h1>
		<h2 class="text-xl">Share and discover valuable learning resources</h2>
	</section>
	<!-- #CBD5E1 -->
	<form
		method="post"
		class="flex w-5/12 flex-col gap-4 rounded-2xl border border-slate-300 p-4"
		use:enhance={() => {
			hideNameFields = !hideNameFields;
		}}
	>
		<span class="mb-2 self-center rounded-full bg-black p-4">
			<CircleUser class="stroke-white" size="32" />
		</span>
		<div class="w-full">
			<Label class="mb-1.5 block font-bold" for="name">Name</Label>
			<div class="flex w-full justify-between">
				<span class="self-center" id="name">{user?.user_metadata.display_name ?? 'None found'}</span
				>
				<Button
					class={hideNameFields ? 'flex' : 'hidden'}
					type="button"
					onclick={() => (hideNameFields = !hideNameFields)}>Update Name</Button
				>
			</div>
			<div class={hideNameFields ? 'hidden' : 'flex flex-col gap-3'}>
				<Input
					type="text"
					name="firstName"
					id="firstName"
					placeholder="Enter your first name"
					bind:value={firstName}
				/>
				<Input
					type="text"
					name="lastName"
					id="lastName"
					placeholder="Enter your last name"
					bind:value={lastName}
				/>
				<Button type="submit">Update Name</Button>
			</div>
		</div>
		<div class="w-full">
			<Label class="mb-1.5 block font-bold" for="password">Password</Label>
			<div class="flex w-full justify-between">
				<span class="self-center" id="password">*******</span>
				<Button
					class={hidePasswordField ? 'flex' : 'hidden'}
					type="button"
					onclick={() => (hidePasswordField = !hidePasswordField)}>Update Password</Button
				>
			</div>
			<div class={hidePasswordField ? 'hidden' : 'flex flex-col gap-3'}>
				<Input type="password" name="password" id="password" placeholder="*******" />
				<Button type="submit">Update Password</Button>
			</div>
		</div>
		<div class="w-full">
			<Label class="mb-1.5 block font-bold" for="email">Email</Label>
			<div class="flex w-full justify-between">
				<span class="self-center" id="email">{user?.email}</span>
				<Button
					class={hideEmailField ? 'flex' : 'hidden'}
					type="button"
					onclick={() => (hideEmailField = !hideEmailField)}>Update Name</Button
				>
			</div>
			<div class={hideEmailField ? 'hidden' : 'flex flex-col gap-3'}>
				<Input type="password" name="password" id="email" placeholder={user?.email} />
				<Button type="submit">Update Email</Button>
			</div>
		</div>
		<!-- <Button class="p-2 bg-black text-white rounded-lg cursor-pointer" type="submit">Login</Button> -->
		<!-- {#if form?.error}
			<p class="text-sm text-red-500">{form.error}</p>
		{/if} -->
		<!-- <p class="text-center">
			Don't have an account? <a class="underline underline-offset-3" href="/signup">Sign up</a>
		</p> -->
	</form>
</main>
