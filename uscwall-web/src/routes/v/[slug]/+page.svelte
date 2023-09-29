<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { onMount } from 'svelte';

	import { resolveTag } from '../../../helpers';
	import { routes } from '../../../stores/routes';
	import AscentModal from '../../../components/AscentModal.svelte';
	import { ascents } from '../../../stores/ascents';
	import { goto } from '$app/navigation';

	let routeID = $page.params.slug;
	$: userSent = $ascents.ascents.map((a) => a.route_id).includes(routeID);
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

	const handleShowAscentModal = () => {
		showAscentModal = true;
	};

	const handleGoToRoute = (nextID?: string | null) => () => {
		if (nextID != null) {
			goto(`/v/${nextID}`);
			routeID = nextID;
		}
	};

	let showAscentModal = false;
</script>

{#if route != null}
	<div class="route">
		<img class="image" src={route.image_url} alt={route.route_name} />
		<button on:click={() => window.open(route.image_url, '_blank')}>View/Download Full Image</button
		>
		<button on:click={handleShowAscentModal}>Log Ascent...</button>
		<AscentModal bind:showModal={showAscentModal} routeID={route.id} />
		<div id="route-toolbar">
			<div class="toolbar-content responsive-width">
				<button on:click={handleGoToRoute(route.prev)} disabled={route.prev === null}>Prev.</button>
				<div class="toolbar-center">
					{route.route_name}
					{#if userSent}
						✅
					{/if}
					<span class={`tag ${resolveTag(route.grade)}`}>{route.grade}</span>
					<small>
						Set by {route.setter_name} ({route.setter_handle}) | {route.ascents} Ascents
					</small>
				</div>
				<button on:click={handleGoToRoute(route.next)} disabled={route.next === null}>Next</button>
			</div>
		</div>
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
		padding-bottom: 10rem;
		height: 100%;
		overflow: none;
	}
	#route-toolbar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-top: var(--light-gray) solid 0.3px;
		background: var(--primary);
		height: 5rem;
	}
	.toolbar-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0.5rem;
	}

	.toolbar-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
</style>
