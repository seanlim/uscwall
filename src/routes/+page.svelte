<script lang="ts">
	import { writable } from 'svelte/store';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { goto, prefetch } from '$app/navigation';
	import { base } from '$app/paths';

	import { resolveTag } from '../helpers';
	import { filters } from '../stores/filters';
	import Loading from '../components/Loading.svelte';

	let routes = writable<App.Route[]>([]);

	let searchQuery: string = $filters.query;
	let gradeFilter: string = $filters.grade;
	let sectorFilter: string = $filters.sector;

	$: filteredRoutes = $routes.filter((route) => {
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
		const res = await fetch(`${PUBLIC_HOSTNAME}/api/routes`);
		const data = await res.json();
		if (res.ok) {
			routes.set(data.routes);
			return data;
		} else {
			throw new Error(data);
		}
	}
</script>

{#await fetchRoutes()}
	<Loading />
{:then data}
	<div class="level mb-0 p-2 is-flex is-flex-direction-row is-flex-wrap-wrap">
		<input
			class="input is-rounded mr-2 mb-2 is-flex-grow-1"
			type="text"
			placeholder="Search route or setter name..."
			bind:value={searchQuery}
			on:change={() => filters.update('query', searchQuery)}
		/>
		<div class="select is-rounded mr-2 mb-2">
			<select
				bind:value={gradeFilter}
				on:change={() => {
					filters.update('grade', gradeFilter);
				}}
			>
				<option value="*" selected>All grades</option>
				{#each data.grades as grade}
					<option value={grade}>{grade}</option>
				{/each}
			</select>
		</div>
		<div class="select is-rounded mr-2 mb-2">
			<select
				bind:value={sectorFilter}
				on:change={() => {
					filters.update('sector', sectorFilter);
				}}
			>
				<option value="*" selected>All Sectors</option>
				{#each data.sectors as sector}
					<option value={sector}>{sector}</option>
				{/each}
			</select>
		</div>
		<button class="button" on:click={reset}>Reset</button>
	</div>
	<hr class="m-3" />
	<div class="is-flex is-flex-direction-column routes">
		<div class="is-size-7 has-text-grey-light px-4">
			Showing {filteredRoutes.length} routes
		</div>
		{#each filteredRoutes as route}
			<div
				class="route"
				on:mouseenter={() => prefetch(`${base}/v/${route.id}`)}
				on:mouseup={() => goto(`${base}/v/${route.id}`)}
			>
				<div class="title-row">
					<h3 class="title is-5">
						<a href={`${base}/v/${route.id}`}>
							{route.route_name}
						</a>
					</h3>
					<span class={`tag ${resolveTag(route.grade)} is-light`}>
						{route.grade}
					</span>
				</div>
				Set by {route.setter_name} ({route.setter_handle}) | {route.ascents} Ascents
			</div>
		{/each}
	</div>
{:catch err}
	{err}
{/await}

<style>
	.route {
		content-visibility: auto;
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-bottom: var(--light-gray) 1px solid;
	}

	.route .title-row {
		display: flex;
		flex-direction: row;
		height: 2rem;
		align-items: center;
	}
	.route .title {
		flex: 1;
	}

	.route:hover {
		background: #f5f5f5;
	}
	.route:active {
		outline: auto;
	}
	.routes {
		padding-bottom: 100px;
	}
</style>
