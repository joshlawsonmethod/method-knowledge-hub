<script lang="ts">
	import Badge from '../ui/badge/badge.svelte';
	import * as Card from '$lib/components/ui/card';
	import CardType from '$lib/components/ResourceCard/CardType.svelte';
	import Time from 'svelte-time/Time.svelte';
	import { CircleUser, Edit, ExternalLink, Pencil, Trash2 } from '@lucide/svelte';
	import { drawer } from '$lib/components/Drawer/drawerState.svelte';
	import type { Resource } from '$lib/supabase/schema.types';

	let { resource, currentUserId }: { resource: Resource; currentUserId: string } = $props();

	const handleEdit = (event: MouseEvent) => {
		event.stopPropagation();
		drawer.action = 'edit';
		drawer.isOpen = true;
		drawer.resource = resource;
	};

	const handleDelete = (event: MouseEvent) => event.stopPropagation();
</script>

<Card.Root
	class="flex cursor-pointer flex-col justify-between gap-2.5"
	onclick={() => {
		drawer.action = 'view';
		drawer.isOpen = true;
		drawer.resource = resource;
	}}
>
	<Card.Header class="">
		<CardType type={resource.type} />
		<Card.Title class="text-lg">{resource.title}</Card.Title>
		<Card.Description class="flex-1 text-primary">{resource.description}</Card.Description>
		{#if resource?.author_id === currentUserId}
			<Card.Action class="flex gap-2.5">
				<button type="button" onclick={(event: MouseEvent) => handleEdit(event)}>
					<Pencil class="cursor-pointer" size={20} />
				</button>
				<form method="POST" action="?/delete">
					<button onclick={(event) => handleDelete(event)}>
						<Trash2 class="cursor-pointer" size={20} />
						<input type="hidden" name="id" value={resource.id} />
					</button>
				</form>
			</Card.Action>
		{/if}
	</Card.Header>
	<Card.Action class="px-6 pb-1">
		<a class="flex items-center gap-2" href={resource.url} target="_blank">
			<ExternalLink size={20} /><span class="underline">View article</span>
		</a>
	</Card.Action>
	<Card.Content class="pb-5">
		<ul class="flex gap-2.5">
			{#each resource.tags as tag (tag.tag?.id)}
				<li><Badge variant="outline">{tag.tag?.name}</Badge></li>
			{/each}
		</ul>
	</Card.Content>
	<Card.Footer class="mx-6 flex justify-between border-t px-0">
		<span class="flex items-center gap-1">
			<CircleUser size={36} />
			{`${resource.author?.first_name} ${resource.author?.last_name}`}
		</span>
		<Time relative timestamp={resource.created_at} />
	</Card.Footer>
</Card.Root>
