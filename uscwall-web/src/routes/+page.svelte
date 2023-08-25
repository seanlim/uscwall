<script lang="ts">
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { goto, prefetch } from '$app/navigation';
	import { base } from '$app/paths';

	import { resolveTag } from '../helpers';
	import { filters } from '../stores/filters';
	import { routes } from '../stores/routes';
	import { onMount } from 'svelte';
	import RoutesSkeleton from '../components/RoutesSkeleton.svelte';

	let searchQuery: string = $filters.query;
	let gradeFilter: string = $filters.grade;
	let sectorFilter: string = $filters.sector;

	let isLoading = false;
	let isError = false;

	$: filteredRoutes = $routes.routes.filter((route) => {
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
		return r && g && s;
	});

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

	onMount(() => fetchRoutes());
</script>

<div class="level">
	<input
		class="input"
		type="text"
		placeholder="Search route or setter name..."
		bind:value={searchQuery}
		on:change={() => filters.update('query', searchQuery)}
	/>
	<div class="select">
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
	</div>
	<div class="select">
		<select
			bind:value={sectorFilter}
			on:change={() => {
				filters.update('sector', sectorFilter);
			}}
		>
			<option value="*" selected>All Sectors</option>
			{#each $routes.sectors as sector}
				<option value={sector}>{sector}</option>
			{/each}
		</select>
	</div>
	<button class="button" on:click={reset}>Reset</button>
</div>
<hr />
<div class="routes">
	{#if filteredRoutes.length < 1}
		{#if isLoading}
			<RoutesSkeleton />
		{:else if isError}
			An error has occurred. Please refresh to try again.
		{:else}
			No routes to to display yet!
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
				Set by {route.setter_name} ({route.setter_handle}) | {route.ascents} Ascents
			</span>
		</div>
	{/each}
</div>

<style>
	.route {
		content-visibility: auto;
		cursor: pointer;
		padding: 0.3rem 0.5rem;
		border-bottom: var(--light-gray) 1px solid;
	}

	.route .title-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.route .title {
		font-weight: bold;
		font-size: 1.1rem;
		line-height: 110%;
		flex: 1;
		inline-size: 150px;
		overflow-wrap: break-word;
		margin-right: 10px;
	}
	.route .description {
		font-size: 0.95rem;
	}

	.route:hover {
		background: var(--light-gray);
	}
	.route:active {
		outline: auto;
	}
	.routes {
		padding: 0 0.5rem;
		margin-bottom: 1rem;
	}
</style>
