<script lang="ts">
	// src/routes/+page.svelte
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { BookMarked } from '@lucide/svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<main class="my-6 flex flex-col items-center justify-center">
	<section class="mb-7 flex flex-col items-center justify-center gap-2">
		<span class="mb-2 rounded-full bg-black p-4">
			<BookMarked class="stroke-white" size="32" />
		</span>
		<h1 class="text-center text-3xl font-semibold">Welcome Back</h1>
		<h2 class="text-xl">Share and discover valuable learning resources</h2>
	</section>
	<h3>Hi friend!</h3>
	<!-- #CBD5E1 -->
	<form method="post" class="flex w-5/12 flex-col gap-4 rounded-2xl border border-slate-300 p-4">
		<div class="w-full">
			<h3 class="py-2.5 text-lg">Log in</h3>
			<Label class="mb-1.5 block" for="email">Email</Label>
			<Input
				type="email"
				name="email"
				id="email"
				value={form?.email ?? ''}
				placeholder="Enter your email"
			/>
		</div>
		<div class="w-full">
			<Label class="mb-1.5 block" for="password">Password</Label>
			<Input type="password" name="password" id="password" placeholder="Enter your password" />
		</div>
		<Button class="cursor-pointer rounded-lg bg-black p-2 text-white" type="submit">Login</Button>
		{#if form?.error}
			<p class="text-sm text-red-500">{form.error}</p>
		{/if}
		<p class="text-center">
			Don't have an account? <a class="underline underline-offset-3" href="/signup">Sign up</a>
		</p>
	</form>
</main>
