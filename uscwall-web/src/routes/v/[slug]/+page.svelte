<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { onMount } from 'svelte';

	import { resolveTag } from '../../../helpers';
	import { routes } from '../../../stores/routes';
	import AscentModal from '../../../components/AscentModal.svelte';
	import { ascents } from '../../../stores/ascents';
	import { goto } from '$app/navigation';
	import mixpanel from 'mixpanel-browser';

	const SHARE_BUTTON_LABEL_TEXT = 'Copy route URL';
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

	const shareAction = () => {
		navigator.clipboard.writeText(window.location.href);
		const elem = document.getElementById('share-button');
		if (elem) {
			elem.innerHTML = 'Copied &#10003;';
			setTimeout(() => (elem.innerHTML = SHARE_BUTTON_LABEL_TEXT), 2000);
		}
		mixpanel.track('Shared route', { routeID });
	};

	let showAscentModal = false;
</script>

{#if route != null}
	<div class="route">
		<img class="image" src={route.image_url} alt={route.route_name} />
		<button id="share-button" on:click={shareAction}>{SHARE_BUTTON_LABEL_TEXT}</button>
		<button on:click={() => window.open(route?.image_url, '_blank')}
			>View/Download Full Image</button
		>
		<button on:click={handleShowAscentModal}>Log Ascent...</button>
		<AscentModal bind:showModal={showAscentModal} routeID={route.id} />
		<div id="route-toolbar">
			<div class="toolbar-content responsive-width">
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

	#share-button {
		width: 100%;
		margin-bottom: 1rem;
		background-color: var(--selection);
	}
</style>
