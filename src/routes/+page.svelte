<script lang="ts">
	// src/routes/+page.svelte
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<section class="flex flex-col justify-center items-center my-6">
	<h1 class="text-center text-xl mb-4">Welcome Back</h1>
	<h2 class="text-base mb-4">Share and discover valuable learning resources</h2>
	<form method="post" class="w-1/2 border-2 rounded-xl border-black p-6 flex flex-col gap-4">
		<div class="w-full">
			<label class="text-base block" for="email"> Email </label>
			<input
				class="block border rounded-lg border-black p-2 w-full"
				type="email"
				name="email"
				id="email"
				value={form?.email ?? ''}
				placeholder="Enter your email"
			/>
		</div>
		<div class="w-full">
			<label class="block" for="password"> Password </label>
			<input
				class="block border rounded-lg border-black p-2 w-full"
				type="password"
				name="password"
				id="password"
				placeholder="Enter your password"
			/>
		</div>
		<button class="p-2 bg-black text-white rounded-lg cursor-pointer" type="submit">Login</button>
		{#if form?.error}
			<p class="text-sm text-red-500">{form.error}</p>
		{/if}
	</form>
</section>
