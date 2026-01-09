<script lang="ts">
	import type { Resource } from '$lib/supabase/resource.types';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { ExternalLink } from '@lucide/svelte';
	import { codeToHtml } from 'shiki';

	let { resource }: { resource: Resource } = $props();
	let output = $state('');

	// Use an effect to react to changes and resolve the promise
	$effect(() => {
		if (resource.type === 'code_snippet' && resource.code_snippet) {
			codeToHtml(resource.code_snippet, { lang: 'javascript', theme: 'vitesse-black' }).then(
				(html) => {
					output = html;
				}
			);
		} else {
			output = '';
		}
	});
</script>

<article class="flex h-full w-full max-w-[500px] flex-col gap-4">
	<h2 class="text-lg font-semibold">{resource.title}</h2>
	<p>{resource.description}</p>
	<ul class="flex flex-row flex-wrap gap-2.5">
		{#each resource.tags as tag (tag.tag?.id)}
			<li><Badge variant="outline">{tag.tag?.name}</Badge></li>
		{/each}
	</ul>
	{#if resource.type === 'article'}
		<a class="flex items-center gap-2" href={resource.url} target="_blank">
			<ExternalLink size={20} /><span class="underline">View article</span>
		</a>
	{/if}
	{#if resource.type === 'code_snippet'}
		<div class="overflow-x-auto rounded-md bg-[#121212] p-4 text-sm">
			<div class="w-fit min-w-full">
				{@html output}
			</div>
		</div>
		<!-- <Button>Copy Code Snippet</Button> -->
	{/if}
	<!-- {#if resource.type === "learning_resource"}
        <div></div>
    {/if} -->
</article>
