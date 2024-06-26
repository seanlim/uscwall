<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { onMount } from 'svelte';

	import { resolveTag } from '@/helpers';
	import { routes } from '@/stores/routes';
	import { goto } from '$app/navigation';

	let routeID = $page.params.slug;
	$: route = $routes.routes?.find((r) => r.id == routeID);

	async function fetchRoutes() {
		const res = await fetch(`${PUBLIC_HOSTNAME}/api/routes`);
		const data = await res.json();
		if (res.ok) {
			return routes.update(data);
		} else {
			throw new Error(data);
		}
	}

	onMount(() => {
		fetchRoutes();
	});
</script>

{#if route != null}
	<div class="container">
		<button
			on:click={() => {
				// history.length will always be at least 1
				history.length === 1 ? goto('/') : history.back();
			}}
		>
			&larr; Back to routes</button
		>
		<p>
			{route.route_name}
			<span class={`tag ${resolveTag(route.grade)}`}>{route.grade}</span>
		</p>
		<img class="image" src={route.image_url} alt={route.route_name} />
		<small>
			Set by {route.setter_name} (@{route.setter_handle})
		</small>
		<a href={route?.image_url}> View/Download full image </a>
	</div>
{:else}
	Not found
{/if}

<style>
	.image {
		width: 100%;
		object-fit: contain;
	}
	.container {
		height: 100%;
		padding: 0.3rem;
		overflow: none;
	}
</style>
