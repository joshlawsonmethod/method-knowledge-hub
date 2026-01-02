<script>
	import { cn } from '$lib/utils';
	import * as Field from '../ui/field';
	import * as Select from '../ui/select';
	import { Input } from '../ui/input';
	import { Textarea } from '../ui/textarea';
	import Tags from '../Tags.svelte';
	import { Button } from '$lib/components/ui/button';
	import { XIcon } from '@lucide/svelte';
	import { drawer } from '$lib/components/Drawer/drawerState.svelte';
	import { fly } from 'svelte/transition';

	let resources = $state([
		{ name: 'Article', id: 'article' },
		{ name: 'Code Snippet', id: 'code_snippet' },
		{ name: 'Learning Resource', id: 'learning_resource' }
	]);

	let resource = $state('');

	// $effect(() => console.log({ resource }));

	const triggerContent = $derived(
		resources.find((r) => r.id === resource)?.name ?? 'Select Resource'
	);

	const wrapperClass =
		'w-[511px] h-[888px] p-4 left-0 top-0 absolute bg-white rounded-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] outline outline-1 outline-slate-100 inline-flex flex-col justify-start items-start gap-4';
	const condensedWrapperClass =
		'p-4 top-0 absolute bg-white rounded-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] outline outline-1 outline-slate-100 flex flex-col justify-start items-start gap-4';
</script>

{#if drawer.isOpen}
	<aside
		class={cn('absolute right-0 h-[87svh]', condensedWrapperClass)}
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
	</aside>
{/if}
