<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
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
	Loading...
{:then routes}
	{#each routes as route}
		<div class="is-flex is-flex-direction-column is-flex-grow-1">
			<div class="image-container is-flex-shrink-1">
				<img alt="route" class="route-image" src={route.image_url} />
			</div>
			<div class="info-container p-2 is-flex-grow-1">
				<h1 class="title">
					{route.route_name}
					<span class={`tag is-medium is-light ${resolveTag(route.grade)}`}>{route.grade}</span>
				</h1>
				<p class="subtitle is-6">
					Set by {route.setter_name} ({route.setter_handle}) | {route.ascents} Ascents
				</p>
				<button
					class="button is-link is-light"
					on:click={() => window.open(route.image_url, '_blank')}>View/Download Full Image</button
				>
			</div>
		</div>
	{:else}
		No route found.
	{/each}
{/await}

<style>
	.image-container {
		min-height: 60vh;
		max-height: 60vh;
		overflow: scroll;
	}
	.route-image {
		background: #f5f5f5;
	}
	.info-container {
		background: white;
	}
</style>
