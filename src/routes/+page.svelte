<script lang="ts">
	import Nav from '../components/Nav.svelte';

	async function fetchRoutes() {
		const res = await fetch('/api/routes');
		const data = await res.json();
		if (res.ok) {
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
			<input class="input is-rounded" type="text" placeholder="Search..." />
			<div class="select is-rounded">
				<select>
					<option value="*" selected>All grades</option>
					{#each data.grades as grade}
						<option value={grade}>{grade}</option>
					{/each}
				</select>
			</div>
			<div class="select is-rounded">
				<select>
					<option value="*" selected>All Sectors</option>
					{#each data.sectors as sector}
						<option value={sector}>{sector}</option>
					{/each}
				</select>
			</div>
			<button class="button">Reset</button>
		</div>
		<hr />
		<div class="box">
			{#each data.routes as route}
				<div class="route">
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
