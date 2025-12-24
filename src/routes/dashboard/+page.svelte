<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const user = $derived(data.session?.user);
</script>

<h1>Welcome to Method Knowledge Hub, {user?.email}</h1>
