<script lang="ts">
	let loadingGiff = 'src/lib/static/load-33_256.gif';
</script>

<div class="spinner-wrapper">
	<div class="spinner text-center">
		<img src={loadingGiff} alt="loading spinner animation" width="101" />
	</div>
</div>

<style>
	.spinner-wrapper {
		position: fixed;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		background-color: rgba(128, 128, 128, 0.1); /* Light grey with 10% opacity */
		z-index: 9999999;
	}

	.spinner {
		width: 11rem;
		height: 11rem;
	}
</style>
