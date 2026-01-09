<script lang="ts">
	import { BookMarked, CircleUser } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import { drawer } from '$lib/components/Drawer/drawerState.svelte';

	let { children, data } = $props();

	const user = $derived(data.session?.user);
</script>

<svelte:head>
	<title>Method Knowledge Hub | Dashboard</title>
</svelte:head>

<header
	class="mb-9 flex items-center justify-between self-stretch bg-white px-12 py-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]"
>
	<section class="flex items-center gap-2">
		<span class="rounded-full bg-black p-2.5">
			<BookMarked class="stroke-white" />
		</span>
		<h1 class="text-xl font-semibold">Method Know</h1>
	</section>
	<section class="flex items-center gap-4">
		<Button
			class="cursor-pointer rounded-lg bg-slate-900 p-2 px-10 pt-2 text-center text-white"
			onclick={() => (drawer.isOpen = true)}>Share Resource</Button
		>
		<a class="flex items-center gap-1.5" href="/profile">
			<CircleUser class="" size="36" />
			<span>{user?.user_metadata.display_name}</span>
		</a>
	</section>
</header>
<main class="relative mx-14">
	{@render children()}
	<Drawer />
</main>
