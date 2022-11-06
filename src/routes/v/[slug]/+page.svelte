<script lang="ts">
	import { page } from '$app/stores';
	import { resolveTag } from '../../../helpers';

	async function fetchRoutes() {
		const res = await fetch(`/api/routes?id=${$page.params.slug}`);
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
		<div class="is-flex is-flex-direction-row is-flex-wrap-wrap-reverse  is-justify-content-center">
			<div class="image-container is-flex is-align-items-center is-justify-content-center">
				<img alt="route" class="route-image" src={route.image_url} />
			</div>
			<div class="info-container block is-flex-shrink-1">
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
		flex: 1;
		min-width: 400px;
		max-width: 400px;
	}
	.route-image {
		flex: 1;
		background: #f5f5f5;
		border-radius: 15px;
		overflow: none;
	}

	.info-container {
		margin-bottom: 1rem;
	}

	@media only screen and (min-width: 800px) {
		/* Styles here */
		.info-container {
			margin-left: 1rem;
		}
	}
</style>
