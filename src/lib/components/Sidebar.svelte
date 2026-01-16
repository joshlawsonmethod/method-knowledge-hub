<script lang="ts">
	import * as Field from './ui/field';
	import { Checkbox } from './ui/checkbox';
	import { badgeVariants } from '$lib/components/ui/badge/index.js';
	import { supabase } from '$lib/supabaseClient';
	import { cn } from '$lib/utils';
	import type { ResourceType, Tag } from '$lib/supabase/schema.types';

	let { tags, onResourcesUpdate } = $props();

	let checkedBoxes: ResourceType[] = $state([]);
	let activeBadges: Tag[] = $state([]);

	const fetchResources = async (badges: Tag[], types: string[]) => {
		const tagIds = badges.map((b) => b.id);

		const { data, error } = await supabase.rpc('get_resources', {
			tag_ids: tagIds,
			resource_types: checkedBoxes
		});

		if (error) {
			throw Error(error.message);
		}

		onResourcesUpdate(data ?? []);
	};

	const handleCheckChange = (value: ResourceType, boxState: boolean) => {
		boxState
			? (checkedBoxes = [...checkedBoxes, value])
			: (checkedBoxes = checkedBoxes.filter((box) => box !== value));

		fetchResources(activeBadges, checkedBoxes);
	};

	const handleBadge = async (tag: Tag) => {
		const nextBadges = activeBadges.some((b) => b.id === tag.id)
			? activeBadges.filter((b) => b.id !== tag.id)
			: [...activeBadges, tag];

		activeBadges = nextBadges;
		fetchResources(nextBadges, checkedBoxes);
	};
</script>

<aside class="flex w-52 flex-col gap-2.5 rounded-2xl border border-border p-4">
	<h2 class="text-lg font-semibold">Filters</h2>
	<Field.Group>
		<Field.Set>
			<Field.Legend class="font-normal">Resources</Field.Legend>
			<Field.Group class="gap-2.5">
				<Field.Field class="gap-2" orientation="horizontal">
					<Checkbox
						class="h-3.5 w-3.5 border-border"
						id="article"
						checked={checkedBoxes.includes('article')}
						onCheckedChange={(boxState) => handleCheckChange('article', boxState)}
					/>
					<Field.Label for="article" class="font-normal">Articles</Field.Label>
				</Field.Field>
				<Field.Field class="gap-2" orientation="horizontal">
					<Checkbox
						class="h-3.5 w-3.5 border-border"
						id="code_snippet"
						checked={checkedBoxes.includes('code_snippet')}
						onCheckedChange={(boxState) => handleCheckChange('code_snippet', boxState)}
					/>
					<Field.Label for="code_snippet" class="font-normal">Code Snippets</Field.Label>
				</Field.Field>
				<Field.Field class="gap-2" orientation="horizontal">
					<Checkbox
						class="h-3.5 w-3.5 border-border"
						id="learning_resource"
						checked={checkedBoxes.includes('learning_resource')}
						onCheckedChange={(boxState) => handleCheckChange('learning_resource', boxState)}
					/>
					<Field.Label for="learning_resource" class="font-normal">Learning Resources</Field.Label>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Field.Group>
	<section class="w-full">
		<h3 class="mb-2.5">Tags</h3>
		<div class="flex flex-wrap gap-2.5">
			{#each tags as tag}
				<button
					class={cn(
						badgeVariants({
							variant: activeBadges.some((badge) => badge.id === tag.id) ? 'default' : 'outline'
						}),
						'cursor-pointer'
					)}
					onclick={() => handleBadge(tag)}>{tag.name}</button
				>
			{/each}
		</div>
	</section>
</aside>
