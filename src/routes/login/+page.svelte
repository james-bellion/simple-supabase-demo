<script lang="ts">
	export let data;
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { goto } from '$app/navigation';

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	console.log(supabase);
	console.log(session);

	$: if (session) {
		goto(`/${session.user.email}`);
	}
</script>

<div class="bg-base-300 flex min-h-screen items-center justify-center px-4">
	<div
		class="bg-base-100 flex w-full max-w-md flex-col items-center justify-center space-y-2 rounded-2xl p-8 text-center shadow-xl"
	>
		<h1 class="text-primary text-3xl font-bold">Welcome!</h1>
		<p class="text-base-content">Create an account or log in below to access your personal page.</p>

		<Auth
			supabaseClient={supabase}
			theme="dark"
			appearance={{
				theme: ThemeSupa,
				style: {
					input: 'width: 100%',
					container: 'background-color: #1f2937; padding-inline: 2rem; border-radius: 0.5rem;'
				}
			}}
		/>
	</div>
</div>
