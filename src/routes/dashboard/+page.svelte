<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group';
	import ResourceCard from '$lib/components/ResourceCard/ResourceCard.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Search } from '@lucide/svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page, navigating } from '$app/state';

	let { data }: { data: PageData } = $props();
	let resources = $derived(data.resources ?? []);
	const currentUserId = $derived(data.session?.user.id ?? '');

	let searchTerm = $state(page.url.searchParams.get('search') ?? '');
	let timer: NodeJS.Timeout;

	const isLoading = $derived(!!navigating.to);

	const updateResources = (newResources: typeof resources) => (resources = newResources);

	function handleSearch(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		searchTerm = value;

		clearTimeout(timer);

		timer = setTimeout(() => {
			const newUrl = new URL(page.url);

			if (value) {
				newUrl.searchParams.set('search', value);
			} else {
				newUrl.searchParams.delete('search');
			}

			goto(newUrl, { keepFocus: true, noScroll: true });
		}, 300);
	}
</script>

<div class="my-11">
	<h2 class="mb-2.5 justify-start self-stretch text-3xl font-semibold text-slate-900">
		Discover Resources
	</h2>
	<h4 class="mb-3.5 text-xl">Explore shared knowledge from our community</h4>
	<InputGroup.Root class="border-slate-300">
		<InputGroup.Input
			class="text-slate-400"
			placeholder="Search resource by title or description..."
			value={searchTerm}
			oninput={handleSearch}
		/>
		<InputGroup.Addon class="">
			<Search class="size-6" />
		</InputGroup.Addon>
	</InputGroup.Root>
</div>

<section class="flex w-full gap-8">
	<Sidebar tags={data.tags ?? []} onResourcesUpdate={updateResources} />
	<section class="w-full" id="cards">
		<h3 class="pb-4 text-xl">{resources?.length} Resources found</h3>
		<article class="grid grid-cols-2 gap-4">
			{#each resources as resource (resource.id)}
				<ResourceCard {resource} {currentUserId} />
			{/each}
		</article>
	</section>
</section>
