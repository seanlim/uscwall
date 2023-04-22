<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_HOSTNAME } from '$env/static/public';

	import Loading from '../../../components/Loading.svelte';
	import { resolveTag } from '../../../helpers';

	async function fetchRoutes() {
		const res = await fetch(`${PUBLIC_HOSTNAME}/api/routes?id=${$page.params.slug}`);
		const data = await res.json();
		if (res.ok) {
			return data.routes;
		} else {
			throw new Error(data);
		}
	}
</script>

{#await fetchRoutes()}
	<Loading />
{:then routes}
	{#each routes as route}
		<div class="route">
			<img class="image" src={route.image_url} alt={route.route_name} />
			<span class="title">
				{route.route_name}
				<span class={`tag ${resolveTag(route.grade)}`}>{route.grade}</span>
			</span>
			<p>
				Set by {route.setter_name} ({route.setter_handle}) | {route.ascents} Ascents
			</p>
			<button on:click={() => window.open(route.image_url, '_blank')}
				>View/Download Full Image</button
			>
		</div>
	{:else}
		No route found.
	{/each}
{:catch error}
	{error}
{/await}

<style>
	.image {
		width: 100%;
		object-fit: contain;
		margin-bottom: 1rem;
	}
	.route {
		padding: 0 1rem;
		height: 100%;
		overflow: none;
	}
	.title {
		inline-size: 80vw;
		font-size: 1.3rem;
		line-height: 2.2rem;
		font-weight: bold;
		overflow-wrap: break-word;
	}
</style>
