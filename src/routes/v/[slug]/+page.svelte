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
		<div class="columns">
			<div class="column">
				<img src={route.image_url} />
			</div>
			<div class="column block">
				<h1 class="title">
					{route.route_name}
					<span class={`tag is-medium is-light ${resolveTag(route.grade)}`}>{route.grade}</span>
				</h1>
			</div>
		</div>
	{:else}
		No route found.
	{/each}
{/await}
