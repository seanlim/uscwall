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
			<div class="image-wrapper is-flex-grow-1">
				<img class="image" src={route.image_url} alt="image" />
			</div>
			<div class="info-container">
				<h1 class="title is-5">
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
	.image-wrapper {
		flex: 1;
		overflow: scroll;
	}
	.image {
		margin-bottom: 200px;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.info-container {
		position: absolute;
		bottom: 10px;
		left: 10px;
		right: 10px;
		background: white;
		border-radius: 10px;
		padding: 0.8rem;
		border: solid #f5f5f5 3px;
	}
</style>
