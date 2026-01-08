<script lang="ts">
	import * as Field from './ui/field';
	import { Checkbox } from './ui/checkbox';
	import type { Database } from '$lib/supabase/database.types';
	import { badgeVariants } from '$lib/components/ui/badge/index.js';
	import { supabase } from '$lib/supabaseClient';

	type Tag = Database['public']['Tables']['tags']['Row'];
	// type Resource = Database['public']['Tables']['resources']['Row'];

	let { tags, onResourcesUpdate } = $props();

	let checkedBoxes: string[] = $state([]);
	let activeBadges: Tag[] = $state([]);

	const handleCheckChange = (value: string, boxState: boolean) =>
		boxState
			? (checkedBoxes = [...checkedBoxes, value])
			: (checkedBoxes = checkedBoxes.filter((box) => box !== value));

	let requestId = 0;

	const fetchResources = async (badges: Tag[]) => {
		const id = ++requestId;
		const tagIds = badges.map((b) => b.id);

		console.log('RPC return', tagIds);

		const { data, error } = await supabase.rpc('get_resources_by_tags', {
			tag_ids: tagIds
		});

		if (error) {
			throw Error(error.message);
		}

		if (id !== requestId) return;

		onResourcesUpdate(data ?? []);
	};

	const handleBadge = async (tag: Tag) => {
		const nextBadges = activeBadges.some((b) => b.id === tag.id)
			? activeBadges.filter((b) => b.id !== tag.id)
			: [...activeBadges, tag];

		activeBadges = nextBadges;

		console.log(
			'Active badges:',
			nextBadges.map((b) => b.id)
		);
		fetchResources(nextBadges);
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
						id="learning_resources"
						checked={checkedBoxes.includes('learning_resources')}
						onCheckedChange={(boxState) => handleCheckChange('learning_resources', boxState)}
					/>
					<Field.Label for="learning_resources" class="font-normal">Learning Resources</Field.Label>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Field.Group>
	<section class="w-full">
		<h3>Tags</h3>
		<div>
			{#each tags as tag}
				<button
					class={badgeVariants({
						variant: activeBadges.some((badge) => badge.id === tag.id) ? 'default' : 'secondary'
					})}
					onclick={() => handleBadge(tag)}>{tag.name}</button
				>
			{/each}
		</div>
	</section>
</aside>
