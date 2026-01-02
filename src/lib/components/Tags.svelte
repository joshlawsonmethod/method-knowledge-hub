<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { XIcon } from '@lucide/svelte';

	let tags = $state<string[]>([]);
	let draft = $state('');

	const addTag = () => {
		const value = draft.trim();
		if (!value) return;

		const exists = tags.some((t) => t.toLowerCase() === value.toLowerCase());
		if (exists) {
			draft = '';
			return;
		}
		tags = [...tags, value];
		draft = '';
	};

	const removeTag = (tag: string) => (tags = tags.filter((t) => t !== tag));

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
		// Optional: backspace to remove last tag when input empty
		if (e.key === 'Backspace' && draft.length === 0 && tags.length > 0) {
			removeTag(tags[tags.length - 1]);
		}
	};

	const tagsCSV = $derived(
		tags
			.map((tag) => tag.trim())
			.filter(Boolean)
			.join(',')
	);
</script>

<div class="w-full max-w-md">
	<Field.Field>
		<Field.Label for="tags">Tags</Field.Label>
		<div class="flex gap-2">
			<InputGroup.Root>
				{#if tags.length > 0}
					<InputGroup.Addon class="flex gap-1 ps-2">
						{#each tags as tag}
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
									onclick={() => removeTag(tag)}
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
					placeholder={tags.length === 0 ? 'Add tags' : ''}
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
