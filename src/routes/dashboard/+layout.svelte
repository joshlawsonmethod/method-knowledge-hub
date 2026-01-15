<script lang="ts">
	import { Bookmark, BookMarked, CircleUser, LogOut } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import { drawer } from '$lib/components/Drawer/drawerState.svelte';

	let { children, data } = $props();

	const user = $derived(data.session?.user);
</script>

<svelte:head>
	<title>Method Knowledge Hub | Dashboard</title>
</svelte:head>

<header
	class="mb-9 flex items-center justify-between self-stretch bg-white px-12 py-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]"
>
	<section class="flex items-center gap-2">
		<span class="rounded-full bg-black p-2.5">
			<BookMarked class="stroke-white" />
		</span>
		<h1 class="text-xl font-semibold">Method Know</h1>
	</section>
	<section class="flex items-center gap-4">
		<Button
			class="cursor-pointer rounded-lg bg-slate-900 p-2 px-10 pt-2 text-center text-white"
			onclick={() => (drawer.isOpen = true)}
		>
			Share Resource
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex cursor-pointer items-center gap-1.5">
				<CircleUser class="" size="36" />
				<span>{user?.user_metadata.display_name}</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label><a href="/profile">My Account</a></DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<a href="##" class="flex items-center gap-2">
							<Bookmark strokeWidth={2} color="black" />Your Shared Resources</a
						>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<form method="POST" action="/logout">
							<button class="flex items-center gap-2" type="button">
								<LogOut strokeWidth={2} color="black" /> Logout
							</button>
						</form>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</section>
</header>
<main class="relative mx-14">
	{@render children()}
	<Drawer />
</main>
