<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Search } from '@lucide/svelte';
	import type { PageData } from './$types';
	import ResourceCard from '$lib/components/ResourceCard/ResourceCard.svelte';

	let { data }: { data: PageData } = $props();
	let resources = $state(data.resources ?? []);
	// const user = $derived(data.session?.user);

	const updateResources = (newResources: typeof resources) => (resources = newResources);
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
				<ResourceCard {resource} />
			{/each}
		</article>
	</section>
</section>
