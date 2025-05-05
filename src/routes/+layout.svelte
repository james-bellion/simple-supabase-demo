<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { faListAlt } from '@fortawesome/free-regular-svg-icons';
	import '../app.css';
	import Fa from 'svelte-fa';
	import { faHome } from '@fortawesome/free-solid-svg-icons';

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

<div class="fixed top-0 right-0 left-0 max-h-33 justify-between bg-[#1D1D1D] py-2">
	<div class="navbar mx-auto flex max-w-3xl justify-between">
		<!--left side of navbar-->
		<div class="px-2">
			<button type="button" class=" btn preset-outlined-primary-500 rounded-[4px]">
				<span> <a href="/">Supabase todos</a> </span>
				<Fa icon={faHome} />
			</button>
			<!-- <a href="/" class="btn btn-ghost text-xl">Supabase todos</a> -->
			{#if session !== null}
				<button type="button" class="btn preset-outlined-primary-500 ml-2 rounded-[4px]">
					<span> <a href="/{session.user.email}">My Todos</a> </span>
					<Fa icon={faListAlt} />
				</button>
			{/if}
		</div>
		<!--right side of navbar-->
		<div class="flex flex-wrap items-center gap-2 text-white">
			{#if session === null}
				<button
					type="button"
					class="btn preset-outlined-success-500 mr-2 rounded-[4px]"
					onclick={() => goto('/login')}
				>
					Login
				</button>
			{:else}
				<span class="max-w-[200px] text-lg break-all sm:max-w-xs">{session.user.email}</span>
				<button
					type="button"
					class="btn preset-tonal-error"
					onclick={async () => {
						await supabase.auth.signOut();
						goto('/');
					}}
				>
					Logout
				</button>
			{/if}
		</div>
	</div>
</div>

{@render children()}
