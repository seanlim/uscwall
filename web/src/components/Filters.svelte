<script lang="ts">
	import { filters } from '@stores/filters';
	import { routes } from '@stores/routes';

	function reset() {
		filters.reset();
	}
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
		{#each $routes.sectors ?? [] as sector}
			<option value={sector}>{sector}</option>
		{/each}
	</select>
	<button on:click={reset}>Reset filters</button>
</div>
<hr />

<style>
	.filters-container {
		display: flex;
		flex-direction: column;
		padding: 5px;
	}
	.filters-container > * {
		margin-bottom: 0.5rem;
	}
	.filters-container select {
		padding: 0.2rem;
	}
</style>
