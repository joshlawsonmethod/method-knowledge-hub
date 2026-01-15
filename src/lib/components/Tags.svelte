<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { XIcon } from '@lucide/svelte';
	import type { Resource } from '$lib/supabase/schema.types';

	let { tags = $bindable() }: { tags?: Resource['tags'] } = $props();

	// we really only need the slug or the name
	// svelte-ignore state_referenced_locally
	let values = $state(tags?.map(({ tag }) => tag.slug) ?? []);
	let draft = $state('');

	const addTag = () => {
		const value = draft.trim();
		if (!value) return;

		const exists = values.some((tag) => tag.toLowerCase() === value.toLowerCase());
		if (exists) {
			draft = '';
			return;
		}
		values = [...values, value];
		draft = '';
	};

	const removeValue = (value: string) => (values = values.filter((t) => t !== value));

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
		// Optional: backspace to remove last tag when input empty
		if (e.key === 'Backspace' && draft.length === 0 && values.length > 0) {
			removeValue(values[values.length - 1]);
		}
	};

	const tagsCSV = $derived(
		values
			.map((value) => value.trim())
			.filter(Boolean)
			.join(',')
	);
</script>

<div class="w-full max-w-md">
	<Field.Field>
		<Field.Label for="tags">Tags</Field.Label>
		<div class="flex gap-2">
			<InputGroup.Root>
				{#if values.length > 0}
					<InputGroup.Addon class="flex gap-1 ps-2">
						{#each values as tag}
							<!-- <div class="h-5 p-2 left-0 top-0 absolute bg-black rounded-[50px] outline outline-1 outline-offset-[-1px] outline-black/20 inline-flex justify-center items-center gap-2.5"> -->

							<Badge
								variant="secondary"
								class="flex items-center gap-1 rounded-4xl bg-black pr-1 pl-2 text-white"
							>
								{tag}
								<button
									type="button"
									class="inline-flex items-center justify-center rounded-full p-0.5 hover:bg-muted"
									aria-label="Remove tag"
									onclick={() => removeValue(tag)}
								>
									<XIcon class="size-3" />
								</button>
							</Badge>
						{/each}
					</InputGroup.Addon>
				{/if}

				<InputGroup.Input
					id="tag-display"
					data-slot="input-group-control"
					placeholder={values?.length === 0 ? 'Add tags' : ''}
					bind:value={draft}
					onkeydown={handleKeydown}
					class="min-w-24"
				/>
			</InputGroup.Root>
			<input type="hidden" name="tags" value={tagsCSV} />
			<Button
				type="button"
				size="sm"
				variant="secondary"
				aria-label="Add tag"
				onclick={addTag}
				class="h-auto rounded-md border border-slate-300"
			>
				Add
			</Button>
		</div>
	</Field.Field>
</div>
