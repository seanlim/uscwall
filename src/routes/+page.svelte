<script lang="ts">
	import { writable } from 'svelte/store';
	import Nav from '../components/Nav.svelte';

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
		const res = await fetch('/api/routes');
		const data = await res.json();
		if (res.ok) {
			routes.set(data.routes);
			return data;
		} else {
			throw new Error(data);
		}
	}

	function resolveTag(grade: string) {
		if (grade.includes('V2')) {
			return 'is-primary';
		}
		if (grade.includes('V3')) {
			return 'is-info';
		}
		if (grade.includes('V5')) {
			return 'is-danger';
		}
		// defaults to V0
	}
</script>

<Nav />
<div class="container">
	{#await fetchRoutes()}
		loading...
	{:then data}
		<div class="level">
			<input
				class="input is-rounded"
				type="text"
				placeholder="Search..."
				bind:value={searchQuery}
			/>
			<div class="select is-rounded">
				<select bind:value={gradeFilter}>
					<option value="*" selected>All grades</option>
					{#each data.grades as grade}
						<option value={grade}>{grade}</option>
					{/each}
				</select>
			</div>
			<div class="select is-rounded">
				<select bind:value={sectorFilter}>
					<option value="*" selected>All Sectors</option>
					{#each data.sectors as sector}
						<option value={sector}>{sector}</option>
					{/each}
				</select>
			</div>
			<button class="button" on:click={reset}>Reset</button>
		</div>
		<hr />
		<div class="box">
			{#each filteredRoutes as route}
				<div class="route" on:click={() => window.open(route.image_url, '_blank')}>
					<h3 class="title is-5">
						{route.route_name}
						<span class={`tag ${resolveTag(route.grade)} is-light`}>
							{route.grade}
						</span>
					</h3>
					<p class="subtitle is-6">
						Set by {route.setter_name} ({route.setter_handle})
					</p>
				</div>
			{/each}
		</div>
	{:catch err}
		{err}
	{/await}
</div>

<style>
	.route {
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
</style>
