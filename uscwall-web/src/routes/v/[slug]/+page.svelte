<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { onMount } from 'svelte';

	import { resolveTag } from '../../../helpers';
	import { routes } from '../../../stores/routes';
	import AscentModal from '../../../components/AscentModal.svelte';

	async function fetchRoutes() {
		const res = await fetch(`${PUBLIC_HOSTNAME}/api/routes`);
		const data = await res.json();
		if (res.ok) {
			return routes.update(data);
		} else {
			throw new Error(data);
		}
	}

	onMount(() => fetchRoutes());

	const route = $routes.routes.find((r) => r.id == $page.params.slug);

	const handleShowAscentModal = () => {
		showAscentModal = true;
	};

	let showAscentModal = false;
</script>

{#if route != null}
	<div class="route">
		<img class="image" src={route.image_url} alt={route.route_name} />
		<span class="title">
			{route.route_name}
			<span class={`tag ${resolveTag(route.grade)}`}>{route.grade}</span>
		</span>
		<p>
			Set by {route.setter_name} ({route.setter_handle}) | {route.ascents} Ascents
		</p>
		<button on:click={() => window.open(route.image_url, '_blank')}>View/Download Full Image</button
		>
		<button on:click={handleShowAscentModal}>Log Ascent...</button>
		<AscentModal bind:showModal={showAscentModal} routeID={route.id} />
	</div>
{:else}
	Not found
{/if}

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
