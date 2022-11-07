<script lang="ts">
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { goto, prefetch } from '$app/navigation';
	import { resolveTag } from '../helpers';
	import { writable } from 'svelte/store';

	let routes = writable<App.Route[]>([]);

	let searchQuery: string = '';
	let gradeFilter: string = '*';
	let sectorFilter: string = '*';

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
		searchQuery = '';
		gradeFilter = '*';
		sectorFilter = '*';
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
	loading...
{:then data}
	<div class="level mb-0 p-2">
		<input
			class="input is-rounded mr-2 mb-2"
			type="text"
			placeholder="Search route or setter name..."
			bind:value={searchQuery}
		/>
		<div class="select is-rounded mr-2 mb-2">
			<select bind:value={gradeFilter}>
				<option value="*" selected>All grades</option>
				{#each data.grades as grade}
					<option value={grade}>{grade}</option>
				{/each}
			</select>
		</div>
		<div class="select is-rounded mr-2 mb-2">
			<select bind:value={sectorFilter}>
				<option value="*" selected>All Sectors</option>
				{#each data.sectors as sector}
					<option value={sector}>{sector}</option>
				{/each}
			</select>
		</div>
		<button class="button" on:click={reset}>Reset</button>
	</div>
	<hr class="mt-1 mb-5" />
	<div class="box is-flex is-flex-direction-column routes">
		<span class="is-size-7 has-text-grey-light">
			Showing {filteredRoutes.length} routes
		</span>
		{#each filteredRoutes as route}
			<div
				class="route"
				on:mouseenter={() => prefetch(`/v/${route.id}`)}
				on:mouseup={() => goto(`/v/${route.id}`)}
			>
				<h3 class="title is-5">
					<a href={`/v/${route.id}`}>
						{route.route_name}
					</a>
					<span class={`tag ${resolveTag(route.grade)} is-light`}>
						{route.grade}
					</span>
				</h3>
				<p class="subtitle is-6">
					Set by {route.setter_name} ({route.setter_handle}) | {route.ascents} Ascents
				</p>
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
		padding: 1rem;
		border-bottom: solid #f5f5f5 1px;
	}

	.route:hover {
		background: #f5f5f5;
	}
	.route:active {
		outline: auto;
	}
	.routes {
		overflow-y: scroll;
		padding-bottom: 100px;
	}
</style>
