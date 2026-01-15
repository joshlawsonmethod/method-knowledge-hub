<script lang="ts">
	import type { Resource } from '$lib/supabase/schema.types';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import CardType from '../ResourceCard/CardType.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import { drawer } from './drawerState.svelte';
	// import { codeToHtml } from 'shiki';

	let { resource }: { resource: Resource } = $props();
	// let output = $state('');

	// Use an effect to react to changes and resolve the promise
	// $effect(() => {
	// 	if (resource.type === 'code_snippet' && resource.code_snippet) {
	// 		codeToHtml(resource.code_snippet, { lang: 'javascript', theme: 'vitesse-black' }).then(
	// 			(html) => {
	// 				output = html;
	// 			}
	// 		);
	// 	} else {
	// 		output = '';
	// 	}
	// });
</script>

<form method="POST" action="?/edit-resource" class="flex h-full w-full flex-col gap-4">
	<CardType type={resource.type} />
	<Field.Set class="h-full">
		<Field.Group class="h-full justify-between">
			<div class="flex flex-col gap-4">
				<input type="hidden" value={resource.id} name="editing-id" />
				<Field.Field>
					<Field.Label for="title">Title</Field.Label>
					<Input
						class=""
						id="title"
						name="title"
						placeholder="Enter a descriptive title"
						value={resource.title}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="description">Description</Field.Label>
					<Textarea
						class=""
						id="description"
						name="description"
						placeholder="Enter a detailed description"
						value={resource.description}
					/>
				</Field.Field>
				<Tags tags={resource.tags} />
				<Field.Field class={resource.type === 'code_snippet' ? 'block' : 'hidden'}>
					<Field.Label for="code-snippet">Code Snippet</Field.Label>
					<Textarea
						class=""
						id="code-snippet"
						name="code-snippet"
						placeholder="Enter a detailed description"
						value={resource.code_snippet}
					/>
				</Field.Field>
				<Field.Field class={resource.type === 'code_snippet' ? 'hidden' : 'block'}>
					<Field.Label for="url">Article Url</Field.Label>
					<Input
						class=""
						id="url"
						name="url"
						placeholder="example.com/article"
						value={resource.url}
					/>
				</Field.Field>
			</div>
			<div class="flex flex-col gap-4">
				<Field.Separator />
				<Field.Field class="flex" orientation="responsive">
					<Button
						class="flex-1"
						type="button"
						variant="outline"
						onclick={() => (drawer.isOpen = false)}>Cancel</Button
					>
					<Button class="flex-1" type="submit">Save Changes</Button>
				</Field.Field>
			</div>
		</Field.Group>
	</Field.Set>
</form>
