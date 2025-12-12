<script>
	let { data } = $props();
</script>

<h1>Shalom!</h1>
{console.log({ data })}
<ul>
	{#each data.instruments as instrument}
		<li>{instrument.name}</li>
	{/each}
</ul>
