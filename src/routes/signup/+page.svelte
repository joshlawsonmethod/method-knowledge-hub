<script lang="ts">
	// src/signup/+page.svelte
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { BookMarked } from '@lucide/svelte';

	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
</script>

<svelte:head>
	<title>Method Knowledge Hub | Sign up</title>
</svelte:head>

<main class="my-6 flex h-full w-full flex-col items-center justify-center">
	<section class="mb-7 flex flex-col items-center justify-center gap-2">
		<span class="mb-2 rounded-full bg-black p-4">
			<BookMarked class="stroke-white" size="32" />
		</span>
		<h1 class="text-center text-3xl font-semibold">Join Method Know</h1>
		<h2 class="text-xl">Share and discover valuable learning resources</h2>
	</section>
	<form method="POST" class="flex w-1/3 flex-col gap-4 rounded-xl border-2 border-black p-6">
		<Field.Set>
			<Field.Legend class="text-lg!">Create Account</Field.Legend>
			<Field.Group>
				<Field.Field>
					<Field.Label class="block text-sm" for="firstName">First Name</Field.Label>
					<Input
						type="text"
						name="firstName"
						id="firstName"
						bind:value={firstName}
						placeholder="Enter your first name"
					/>
				</Field.Field>
			</Field.Group>
			<Field.Group>
				<Field.Field>
					<Field.Label class="block text-sm" for="lastName">Last Name</Field.Label>
					<Input
						type="text"
						name="lastName"
						id="lastName"
						bind:value={lastName}
						placeholder="Enter your last name"
					/>
				</Field.Field>
			</Field.Group>
			<Field.Group>
				<Field.Field>
					<Field.Label class="block text-sm" for="email">Email</Field.Label>
					<Input
						type="email"
						name="email"
						id="email"
						bind:value={email}
						placeholder="Enter your email"
					/>
				</Field.Field>
			</Field.Group>
			<Field.Group>
				<Field.Field>
					<Label class="block text-sm" for="password">Password</Label>
					<Input
						type="password"
						name="password"
						id="password"
						bind:value={password}
						placeholder="Create a password"
					/>
				</Field.Field>
			</Field.Group>
		</Field.Set>
		<Button class="" type="submit">Sign up!</Button>
		<p class="text-center">
			Already have an account? <a class="underline underline-offset-3" href="/">Sign in</a>
		</p>
	</form>
</main>
