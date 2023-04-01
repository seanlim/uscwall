<script>
	import Nav from '../components/Nav.svelte';
</script>

<div class="container is-flex is-flex-direction-column">
	<Nav />
	<slot />
</div>

<style global>
	body {
		display: flex;
		overflow: hidden;
		height: 100vh;
		background: #f5f5f5;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.container {
		flex: 1;
		margin: auto;
		max-width: 500px !important;
		height: 100%;
		max-height: 70rem;
		border-radius: 10px;
		overflow: hidden;
		background-color: white;
	}
</style>
