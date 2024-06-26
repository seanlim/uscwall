<script lang="ts">
	import mixpanel from 'mixpanel-browser';
	import { PUBLIC_HOSTNAME, PUBLIC_MIXPANEL_PROJECT_TOKEN } from '$env/static/public';
	import { goto, prefetch } from '$app/navigation';
	import { base } from '$app/paths';

	import { resolveTag } from '@/helpers';
	import { filters } from '@stores/filters';
	import { routes } from '@stores/routes';
	import { onMount } from 'svelte';
	import RoutesSkeleton from '@components/RoutesSkeleton.svelte';
	import EmptyState from './EmptyState.svelte';

	mixpanel.init(PUBLIC_MIXPANEL_PROJECT_TOKEN, {
		track_pageview: true,
		ignore_dnt: true,
		persistence: 'localStorage'
	});

	let isLoading = false;
	let isError = false;

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

	function reset() {
		filters.reset();
	}

	async function fetchRoutes() {
		isLoading = true;
		const res = await fetch(`${PUBLIC_HOSTNAME}/api/routes`);
		const data = await res.json();
		isLoading = false;
		window.Telegram.WebApp.expand();
		if (res.ok) {
			isError = false;
			routes.update(data);
			return data;
		} else {
			isError = true;
			throw new Error(data);
		}
	}

	onMount(() => {
		window.Telegram.WebApp.ready();
		fetchRoutes();
	});
</script>

<div class="filters-container">
	<input
		class="input"
		type="text"
		placeholder="Search route or setter name..."
		bind:value={$filters.query}
		on:change={(e) => filters.update('query', e.target.value)}
	/>
	<select
		bind:value={$filters.grade}
		on:change={(e) => {
			filters.update('grade', e.target.value);
		}}
	>
		<option value="*" selected>All grades</option>
		{#each $routes.grades as grade}
			<option value={grade}>{grade}</option>
		{/each}
	</select>
	<select
		bind:value={$filters.sector}
		on:change={(e) => {
			filters.update('sector', e.target.value);
		}}
	>
		<option value="*" selected>All Sectors</option>
		<!-- TODO: manage this better -->
		{#each $routes.sectors ?? [] as sector}
			<option value={sector}>{sector}</option>
		{/each}
	</select>
	<button class="button" on:click={reset}>Reset filters</button>
</div>
<hr />
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
		Showing {filteredRoutes.length} routes
	{/if}
	{#each filteredRoutes as route}
		<div
			class="route"
			on:mouseenter={() => prefetch(`${base}/v/${route.id}`)}
			on:mouseup={() => goto(`${base}/v/${route.id}`)}
		>
			<img class="thumbnail" src={route.image_url} alt="route" width="50" height="50" />
			<div class="content">
				<div class="title-row">
					<span class="title">
						<a href={`${base}/v/${route.id}`}>
							{route.route_name}
						</a>
					</span>
					<span class={`tag ${resolveTag(route.grade)}`}>
						{route.grade}
					</span>
				</div>
				<span class="description">
					Set by {route.setter_name ?? 'unknown'} | {route.route_type}
				</span>
			</div>
		</div>
	{/each}
</div>

<style>
	.route {
		content-visibility: auto;
		cursor: pointer;
		padding: 0.6rem 0.3rem;
		border-bottom: var(--light-gray) 1px solid;
		display: flex;
		flex-direction: row;
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
		width: 50px;
		height: 50px;
		object-fit: cover;
	}

	.route:hover {
		background: var(--light-gray);
	}
	.route:active {
		outline: auto;
	}

	.filters-container {
		display: flex;
		flex-direction: column;
		padding: 0.3rem;
	}
	.filters-container > * {
		margin-bottom: 10px;
	}
	.routes-container {
		padding: 0 0.5rem;
		margin-bottom: 1rem;
	}
</style>
