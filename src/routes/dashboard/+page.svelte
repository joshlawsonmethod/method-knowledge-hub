<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Search } from '@lucide/svelte';
	import type { PageData } from './$types';
	import ResourceCard from '$lib/components/ResourceCard/ResourceCard.svelte';

	let { data }: { data: PageData } = $props();
	let resources = $state(data.resources ?? []);
	// const user = $derived(data.session?.user);

	const updateResources = (newResources: typeof resources) => {
		resources = (newResources ?? []).map((r) => ({
			...r,
			tags: [...r.tags], // clone array
			author: { ...r.author } // clone object
		}));
	};

	$effect(() => {
		console.log('Parent - resources state:', resources?.length);
	});
</script>

<div class="my-11">
	<p>Debug: {resources?.length} resources</p>
	<p>IDs: {resources?.map((r) => r.id).join(', ')}</p>
	<h2 class="mb-2.5 justify-start self-stretch text-3xl font-semibold text-slate-900">
		Discover Resources
	</h2>
	<h4 class="mb-3.5 text-xl">Explore shared knowledge from our community</h4>
	<InputGroup.Root class="border-slate-300">
		<InputGroup.Input
			class="text-slate-400"
			placeholder="Search resource by title or description..."
		/>
		<InputGroup.Addon class="">
			<Search class="size-6" />
		</InputGroup.Addon>
	</InputGroup.Root>
</div>

<section class="flex w-full gap-8">
	<Sidebar tags={data.tags ?? []} onResourcesUpdate={updateResources} />
	<section class="w-full" id="cards">
		<h2>{resources?.length} Resources found</h2>
		<article class="grid grid-cols-2 gap-4">
			{#each resources as resource (resource.id)}
				<!-- <ResourceCard {resource} /> -->
				<ResourceCard
					resource={{
						...resource,
						tags: [...resource.tags],
						author: { ...resource.author }
					}}
				/>
			{/each}
		</article>
	</section>
</section>

<!-- <section class="flex w-full gap-8">
	<Sidebar tags={data.tags ?? []} onResourcesUpdate={updateResources} />
	<section class="w-full" id="cards">
		<h2>{resources?.length} Resources found</h2>
		<div>
			<p>Resources state: {JSON.stringify(resources?.map((r) => r.id))}</p>
		</div>
		<article class="grid grid-cols-2 gap-4">
			{#each resources as resource (resource.id)}
				<div class="border p-4">
					<h3>{resource.title}</h3>
					<p>ID: {resource.id}</p>
				</div>
			{/each}
		</article>
	</section>
</section> -->
