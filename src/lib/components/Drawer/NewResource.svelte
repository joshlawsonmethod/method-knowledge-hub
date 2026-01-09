<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Tags from '$lib/components/Tags.svelte';
	import { drawer } from '$lib/components/Drawer/drawerState.svelte';

	let { resource } = $props();

	let resources = $state([
		{ name: 'Article', id: 'article' },
		{ name: 'Code Snippet', id: 'code_snippet' },
		{ name: 'Learning Resource', id: 'learning_resource' }
	]);

	const triggerContent = $derived(
		resources.find((r) => r.id === resource)?.name ?? 'Select Resource'
	);
</script>

<form method="POST" class="flex h-full w-full flex-col gap-4">
	<h1 class="text-lg font-semibold">Share a resource</h1>
	<p>Contribute to the knowledge base by sharing valuable content</p>
	<Field.Set class="h-full">
		<Field.Group class="h-full justify-between">
			<div class="flex flex-col gap-4">
				<Field.Field class="w-full">
					<Select.Root type="single" bind:value={resource} name="resource-select">
						<Select.Trigger class="" id="resource-select">
							<span>{triggerContent}</span>
						</Select.Trigger>
						<Select.Content class="bg-white">
							{#each resources as resource}
								<Select.Item value={resource.id}>{resource.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</Field.Field>
				<Field.Field>
					<Field.Label for="title">Title</Field.Label>
					<Input class="" id="title" name="title" placeholder="Enter a descriptive title" />
				</Field.Field>
				<Field.Field>
					<Field.Label for="description">Description</Field.Label>
					<Textarea
						class=""
						id="description"
						name="description"
						placeholder="Enter a detailed description"
					/>
				</Field.Field>
				<Tags />
				<Field.Field class={resource === 'code_snippet' ? 'block' : 'hidden'}>
					<Field.Label for="code-snippet">Code Snippet</Field.Label>
					<Textarea
						class=""
						id="code-snippet"
						name="code-snippet"
						placeholder="Enter a detailed description"
					/>
				</Field.Field>
				<Field.Field class={resource === 'code_snippet' ? 'hidden' : 'block'}>
					<Field.Label for="url">Article Url</Field.Label>
					<Input class="" id="url" name="url" placeholder="example.com/article" />
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
					<Button class="flex-1" type="submit">Share</Button>
				</Field.Field>
			</div>
		</Field.Group>
	</Field.Set>
</form>
