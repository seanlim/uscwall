<script lang="ts">
	import mixpanel from 'mixpanel-browser';
	import {
		PUBLIC_HOSTNAME,
		PUBLIC_MIXPANEL_PROJECT_TOKEN,
		PUBLIC_TELEGRAM_BOT_URL
	} from '$env/static/public';

	import { resolveTag } from '@/helpers';
	import { filters } from '@stores/filters';
	import { routes } from '@stores/routes';
	import { afterUpdate, onMount } from 'svelte';
	import RoutesSkeleton from '@components/RoutesSkeleton.svelte';
	import EmptyState from './EmptyState.svelte';
	import { isTMA as checkTMA } from '@tma.js/sdk';
	import Filters from '@/components/Filters.svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import RouteModal from '@/components/RouteModal.svelte';

	mixpanel.init(PUBLIC_MIXPANEL_PROJECT_TOKEN, {
		track_pageview: true,
		ignore_dnt: true,
		persistence: 'localStorage'
	});

	let isLoading = false;
	let isError = false;
	let scrollY = 0;
	let containerRef: HTMLDivElement;

	let showRouteModal = false;
	let selectedRouteIndex = -1;

	export const snapshot: Snapshot<number> = {
		capture: () => scrollY,
		restore: (scrollValue: number) => (scrollY = scrollValue)
	};

	afterUpdate(() => {
		containerRef.scrollTo({ top: scrollY, behavior: 'smooth' });
	});

	$: filteredRoutes =
		$routes.routes?.filter((route) => {
			let r = false;
			if (
				route.route_name.toLowerCase().includes($filters.query.toLowerCase()) ||
				route.setter_name.toLowerCase().includes($filters.query.toLowerCase()) ||
				route.setter_handle.toLowerCase().includes($filters.query.toLowerCase())
			) {
				r = true;
			}
			let g = $filters.grade == '*';
			if ($filters.grade !== '*' && route.grade == $filters.grade) {
				g = true;
			}
			let s = $filters.sector == '*';
			if ($filters.sector !== '*' && route.route_type == $filters.sector) {
				s = true;
			}
			return r && g && s;
		}) ?? [];

	function didScroll(e: UIEvent) {
		scrollY = e.target.scrollTop;
	}

	async function fetchRoutes() {
		isLoading = true;
		const res = await fetch(`${PUBLIC_HOSTNAME}/api/routes`);
		const data = await res.json();
		isLoading = false;

		if (res.ok) {
			isError = false;
			routes.update(data);
			return data;
		} else {
			isError = true;
			throw new Error(data);
		}
	}

	async function checkIfTMA() {
		const isTMA = await checkTMA();
		if (!isTMA && import.meta.env.PROD) {
			console.error('Non-Telegram client detected. Redirecting to Telegram URL...');
			window.location.replace(PUBLIC_TELEGRAM_BOT_URL);
		}
	}

	onMount(async () => {
		await checkIfTMA();
		await fetchRoutes();

		Telegram.WebApp.ready();
		Telegram.WebApp.expand();
	});

	function handleRouteSelect(idx: number) {
		return () => {
			selectedRouteIndex = idx;
			showRouteModal = true;
		};
	}
</script>

<div class="cont" on:scroll={didScroll} bind:this={containerRef}>
	<Filters />
	<div class="routes-container">
		{#if filteredRoutes.length < 1}
			{#if isLoading}
				<RoutesSkeleton />
			{:else if isError}
				An error has occurred. Please refresh to try again.
			{:else}
				<EmptyState />
			{/if}
		{:else}
			<span class="route-length-label">
				Showing {filteredRoutes.length} routes
			</span>
		{/if}
		{#each filteredRoutes as route, i}
			<button type="button" class="route" on:click={handleRouteSelect(i)}>
				<img class="thumbnail" src={route.image_url} alt="route" width="50" height="50" />
				<div class="content">
					<div class="title-row">
						<span class="title">
							{route.route_name}
						</span>
						<span class={`tag ${resolveTag(route.grade)}`}>
							{route.grade}
						</span>
					</div>
					<span class="description">
						Set by {route.setter_name ?? 'unknown'} | {route.route_type}
					</span>
				</div>
			</button>
		{/each}
	</div>
	<RouteModal
		bind:showModal={showRouteModal}
		bind:selectedIndex={selectedRouteIndex}
		bind:routes={filteredRoutes}
	/>
</div>

<style>
	.cont {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: scroll;
	}
	.route {
		content-visibility: auto;
		cursor: pointer;
		padding: 5px 5px 8px 5px;
		border-bottom: var(--light-gray) 1.3px solid;
		display: flex;
		flex-direction: row;
		background: var(--background);
		color: var(--secondary);
		font-weight: 300;
		text-align: left;
		width: 100%;
	}
	.route .content {
		margin-left: 0.5rem;
		flex: 1;
	}
	.route .title-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.route .title {
		font-weight: bold;
		line-height: 110%;
		flex: 1;
		inline-size: 150px;
		overflow-wrap: break-word;
		margin-right: 10px;
	}
	.route .description {
		font-size: 0.7rem;
	}
	.route .thumbnail {
		width: 3rem;
		height: 3rem;
		object-fit: cover;
		background: var(--light-gray);
	}
	.route:hover {
		background: var(--light-gray);
	}
	.route:active {
		outline: auto;
	}
	.routes-container {
		padding: 0 0 5px 0;
		margin-bottom: 1rem;
		flex: 1;
	}
	.route-length-label {
		padding-left: 0.5em;
		font-size: small;
		font-weight: 500;
	}
</style>
