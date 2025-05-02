<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import '../app.css';

	// export let data;

	const { data, children } = $props();

	let supabase = data.supabase;
	let session = $state(data.session);

	$effect(() => {
		supabase = data.supabase;
		session = data.session;
	});

	// session is null, if session is null we have no user. if its not null, we have a user

	supabase.auth.onAuthStateChange(async (event, session) => {
		if (event === 'SIGNED_IN') {
			invalidateAll();
		}

		if (event === 'SIGNED_OUT') {
			await goto('login');
			invalidateAll();
		}
	});
</script>

<div class="fixed top-0 right-0 left-0 justify-between bg-blue-400">
	<div class="navbar mx-auto flex max-w-3xl justify-between">
		<!--left side of navbar-->
		<div class="px-2">
			<a href="/" class="btn btn-ghost text-xl">James's Page</a>
			{#if session !== null}
				<a href="/{session.user.email}" class="btn btn ghost">My Page</a>
			{/if}
		</div>
		<!--right side of navbar-->
		<div>
			{#if session === null}
				<button onclick={() => goto('/login')}>Login</button>
			{:else}
				<span class="ml-2 text-lg">{session.user.email}</span>
				<button
					class="ml-2"
					onclick={async () => {
						await supabase.auth.signOut();
						goto('/');
					}}>Logout</button
				>
			{/if}
		</div>
	</div>
</div>

{@render children()}
