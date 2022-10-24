<script>
	import Nav from '../components/Nav.svelte';
</script>

<Nav />
<div class="container is-flex is-flex-direction-column">
	<slot />
</div>

<style global>
	body {
		height: 100vh;
		overflow: hidden;
	}
	.container {
		flex: 1;
		height: 100%;
	}
</style>
