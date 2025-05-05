<script lang="ts">
	export let data;
	let session = data.session;

	const technologies = [
		'SvelteKit (Svelte 4 & Svelte 5)',
		'Tailwind CSS & Skeleton UI',
		'Supabase - Auth & DB',
		'Vercel'
	];
</script>

<div class="hero bg-base-300 min-h-screen">
	<div
		class="hero-content flex h-full w-full flex-col items-center justify-center pt-32 text-center md:pt-20"
	>
		<div class="max-w-md">
			<h1 class="text-4xl font-bold text-white">Welcome to Supabase todo's</h1>
			<p class="py-6">
				Create an account to make your own to do list page with your own unique URL!
			</p>
			{#if !session}
				<button>
					<a href="/login" class="btn preset-filled-secondary-500">Create An Account</a>
				</button>
			{/if}
		</div>

		<!-- the rest -->
		<div class="px-4 pt-10 pb-4">
			<p class="text-start">
				This is app is my first time using Supabase with svelte kit and just a way to pratice. Just
				playing around with stuff, nothing super serious Link to github repo <a
					href="https://github.com/james-bellion/simple-supabase-demo"
					class="text-blue-400 underline">here</a
				>
			</p>
			<p class=" pt-5 text-start">For the tech nerds, built using...</p>
			<div class="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
				{#each technologies as tech}
					<div
						class="card preset-filled-surface-100-900 flex h-25 w-full max-w-md items-center justify-center px-2 text-center"
					>
						<p class="text-base font-bold">{tech}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<footer class="bg-surface-100 mt-12 border-t border-gray-300 text-sm text-gray-600">
		<div class="mx-auto max-w-5xl px-6 py-6 text-center">
			<p>
				&copy; {new Date().getFullYear()} James Bellion. All rights reserved. lol jokes copy want you
				want.
			</p>
		</div>
	</footer>
</div>
