<script lang="ts">
	import mixpanel from 'mixpanel-browser';
	import { PUBLIC_HOSTNAME, PUBLIC_MIXPANEL_PROJECT_TOKEN } from '$env/static/public';
	import { goto, prefetch } from '$app/navigation';
	import { base } from '$app/paths';

	import { resolveTag } from '../helpers';
	import { filters } from '../stores/filters';
	import { routes } from '../stores/routes';
	import { onMount } from 'svelte';
	import RoutesSkeleton from '../components/RoutesSkeleton.svelte';
	import { session } from '../stores/session';
	import { ascents } from '../stores/ascents';
	import EmptyState from './EmptyState.svelte';

	mixpanel.init(PUBLIC_MIXPANEL_PROJECT_TOKEN, {
		track_pageview: true,
		ignore_dnt: true,
		persistence: 'localStorage'
	});

	let searchQuery: string = $filters.query;
	let gradeFilter: string = $filters.grade;
	let sectorFilter: string = $filters.sector;
	let hideSent: boolean = false;

	let isLoading = false;
	let isError = false;

	$: filteredRoutes =
		// TODO: manage this better
		$routes.routes?.filter((route) => {
			let r = false;
			if (
				route.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				route.setter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				route.setter_handle.toLowerCase().includes(searchQuery.toLowerCase())
			) {
				r = true;
			}
			let g = gradeFilter == '*';
			if (gradeFilter !== '*' && route.grade == gradeFilter) {
				g = true;
			}
			let s = sectorFilter == '*';
			if (sectorFilter !== '*' && route.route_type == sectorFilter) {
				s = true;
			}
			if (
				$session.user != null &&
				hideSent &&
				$ascents.ascents.map((a) => a.route_id).includes(route.id)
			) {
				return false;
			}
			return r && g && s;
		}) ?? [];

	function reset() {
		filters.reset();
		location.reload();
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

	async function fetchAscents() {
		const res = await fetch(`/api/ascents?username=${$session.user?.telegramUsername}`);
		const data = await res.json();
		ascents.update('ascents', data.results);
	}

	onMount(() => {
		fetchRoutes();
		if ($session.user != null) {
			fetchAscents();
		}
	});
</script>

<div class="filters-container">
	<input
		class="input"
		type="text"
		placeholder="Search route or setter name..."
		bind:value={searchQuery}
		on:change={() => filters.update('query', searchQuery)}
	/>
	<select
		bind:value={gradeFilter}
		on:change={() => {
			filters.update('grade', gradeFilter);
		}}
	>
		<option value="*" selected>All grades</option>
		{#each $routes.grades as grade}
			<option value={grade}>{grade}</option>
		{/each}
	</select>
	<select
		bind:value={sectorFilter}
		on:change={() => {
			filters.update('sector', sectorFilter);
		}}
	>
		<option value="*" selected>All Sectors</option>
		<!-- TODO: manage this better -->
		{#each $routes.sectors ?? [] as sector}
			<option value={sector}>{sector}</option>
		{/each}
	</select>
	{#if $session.user != null}
		<div class="ascents-checkbox-container">
			<input id="hide-ascents-checkbox" type="checkbox" bind:checked={hideSent} />
			<label for="hide-ascents-checkbox">Hide sent problems</label>
		</div>
	{/if}
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
						{#if $session.user != null && $ascents.ascents
								.map((a) => a.route_id)
								.includes(route.id)}
							{' '} ✅{/if}
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
	.ascents-checkbox-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.ascents-checkbox-container > * {
		margin-right: 0.3rem;
	}
</style>
