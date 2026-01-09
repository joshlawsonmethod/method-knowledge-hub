<script lang="ts">
	import Badge from '../ui/badge/badge.svelte';
	import * as Card from '$lib/components/ui/card';
	import CardType from '$lib/components/ResourceCard/CardType.svelte';
	import Time from 'svelte-time/Time.svelte';
	import { CircleUser, ExternalLink, Tag, User } from '@lucide/svelte';

	type Resource = {
		id: number;
		type: 'article' | 'code_snippet' | 'learning_resource';
		title: string;
		description: string;
		url: string | null;
		created_at: string;
		updated_at: string | null;
		author: {
			first_name: string | null;
			last_name: string | null;
		};
		tags: {
			tag: {
				id: number;
				name: string;
				slug: string;
			} | null;
		}[];
	};

	let { resource }: { resource: Resource } = $props();
</script>

<Card.Root class="flex flex-col justify-between gap-2.5">
	<Card.Header class="flex flex-1 flex-col">
		<CardType type={resource.type} />
		<Card.Title class="text-lg">{resource.title}</Card.Title>
		<Card.Description class="flex-1 text-primary">{resource.description}</Card.Description>
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
