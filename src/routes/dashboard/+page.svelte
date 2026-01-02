<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Search } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const user = $derived(data.session?.user);
</script>

<h2 class="mb-2.5 justify-start self-stretch text-3xl font-semibold text-slate-900">
	Discover Resources
</h2>
<h3 class="mb-3.5 text-xl">Explore shared knowledge from our community</h3>
<InputGroup.Root class="border-slate-300">
	<InputGroup.Input
		class="text-slate-400"
		placeholder="Search resource by title or description..."
	/>
	<InputGroup.Addon class="">
		<Search class="size-6" />
	</InputGroup.Addon>
</InputGroup.Root>
