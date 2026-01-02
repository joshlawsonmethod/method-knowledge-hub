<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { Button } from './ui/button';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	const {
		children,
		class: className,
		onclick,
		type,
		variant
	}: {
		children: Snippet;
		class?: string;
		onclick?:
			| (MouseEventHandler<HTMLButtonElement> & MouseEventHandler<HTMLAnchorElement>)
			| null
			| undefined;
		type?: 'submit' | 'reset' | 'button' | null | undefined;
		variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | undefined;
	} = $props();
</script>

<Button
	class={cn('p-2 bg-black text-white rounded-lg cursor-pointer', className)}
	{type}
	{onclick}
	{variant}
>
	{@render children()}
</Button>
