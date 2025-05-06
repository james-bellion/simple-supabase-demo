<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	import LoadingSpinnerr from './LoadingSpinnerr.svelte';
	/**
	 * Store to keep track of loading, helps prevent user interactions when waiting for API responses.
	 */
	export const isLoadingStore = writable(false);
</script>

<script lang="ts">
</script>

{#if $isLoadingStore === true}
	<LoadingSpinnerr />
{/if}
