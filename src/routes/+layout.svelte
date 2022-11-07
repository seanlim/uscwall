<script>
	import Nav from '../components/Nav.svelte';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
</script>

<svelte:head>
	<base href={PUBLIC_HOSTNAME} />
</svelte:head>

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
