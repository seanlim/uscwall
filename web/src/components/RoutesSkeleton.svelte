{#each { length: 8 } as _}
	<div class="route skeleton">
		<div class="skeleton-inner" />
	</div>
{/each}

<style>
	.route {
		content-visibility: auto;
		padding: 0.3rem 0;
		border-bottom: var(--light-gray) 1px solid;
		height: 5rem;
	}
</style>
