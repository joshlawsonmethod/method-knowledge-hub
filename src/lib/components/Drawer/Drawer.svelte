<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { XIcon } from '@lucide/svelte';
	import { drawer } from '$lib/components/Drawer/drawerState.svelte';
	import { fly } from 'svelte/transition';
	import NewResource from './NewResource.svelte';
	import ViewResource from './ViewResource.svelte';
	import EditResource from './EditResource.svelte';

	const condensedWrapperClass =
		'p-4 top-0 absolute bg-white rounded-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] outline outline-1 outline-slate-100 flex flex-col justify-start items-start gap-4';
</script>

{#if drawer.isOpen}
	<aside
		class={cn('drawer absolute right-0 h-[87svh] w-lg', condensedWrapperClass)}
		transition:fly={{ x: 200, duration: 300 }}
	>
		<Button
			class="absolute top-0 right-0"
			onclick={() => (drawer.isOpen = false)}
			variant="ghost"
			type="button"
		>
			<XIcon />
		</Button>
		{#if drawer.action === 'create'}
			<NewResource />
		{:else if drawer.action === 'view' && drawer.resource}
			<ViewResource resource={drawer.resource} />
		{:else if drawer.action === 'edit' && drawer.resource}
			<EditResource resource={drawer.resource} />
		{/if}
	</aside>
{/if}
