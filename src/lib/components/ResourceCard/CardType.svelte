<script lang="ts">
	import type { Database } from '$lib/supabase/database.types';
	import { Code, GraduationCap, Newspaper } from '@lucide/svelte';

	let { type }: { type: Database['public']['Tables']['resources']['Row']['type'] } = $props();
</script>

<span class="inline-flex max-w-fit items-center gap-2 rounded-full border p-2 text-sm leading-0">
	{#if type === 'article'}
		<Newspaper size="20" />
		Article
	{:else if type === 'code_snippet'}
		<Code size="20" />
		Code Snippet
	{:else if type === 'learning_resource'}
		<GraduationCap size="20" />
		Course
	{/if}
</span>
