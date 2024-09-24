<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { onDestroy, onMount } from 'svelte';

	import { resolveTag } from '@/helpers';
	import { routes } from '@/stores/routes';
	import { goto } from '$app/navigation';
	import { BackButton, initBackButton, isTMA, on, type RemoveEventListenerFn } from '@tma.js/sdk';

	let routeID = $page.params.slug;
	$: route = $routes.routes?.find((r) => r.id == routeID);
	let removeListener: RemoveEventListenerFn;
	let backButton: BackButton;

	async function fetchRoutes() {
		const res = await fetch(`${PUBLIC_HOSTNAME}/api/routes`);
		const data = await res.json();
		if (res.ok) {
			return routes.update(data);
		} else {
			throw new Error(data);
		}
	}

	function navigateBack() {
		history.length === 1 ? goto('/') : history.back();
	}

	onMount(async () => {
		fetchRoutes();
		if (await isTMA()) {
			const [bb] = initBackButton();
			bb.show();
			removeListener = on('back_button_pressed', navigateBack);
			backButton = bb;
		}
	});

	onDestroy(() => {
		if (removeListener) {
			removeListener();
			backButton.hide();
		}
	});
</script>

{#if route != null}
	<div class="container">
		<h3>
			{route.route_name}
		</h3>
		<img class="image" src={route.image_url} alt={route.route_name} />
		<span class={`tag ${resolveTag(route.grade)}`}>{route.grade}</span>
		<small>
			Set by {route.setter_name} (@{route.setter_handle})
		</small>
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
	}
</style>
