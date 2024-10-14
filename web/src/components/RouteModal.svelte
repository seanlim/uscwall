<script lang="ts">
	import { resolveTag } from '@/helpers';
	import Modal from './Modal.svelte';

	export let showModal = false;
	export let routes: App.Route[];
	export let selectedIndex: number;

	$: selectedRoute = routes[selectedIndex];

	const incrementIndex = () => {
		selectedIndex += 1;
		cycle();
	};
	const decrementIndex = () => {
		selectedIndex -= 1;
		cycle();
	};
	const cycle = () => {
		selectedIndex = ((selectedIndex % routes.length) + routes.length) % routes.length;
	};
</script>

<Modal bind:showModal>
	{#if selectedRoute}
		<div class="route-details">
			<strong>
				{selectedRoute.route_name}
				<span class={`tag ${resolveTag(selectedRoute.grade)}`}>{selectedRoute.grade}</span>
			</strong>
			<small>
				Set by {selectedRoute.setter_name} (@{selectedRoute.setter_handle})
			</small>
		</div>
		<div class="image-container">
			<img class="image" src={selectedRoute.image_url} alt={selectedRoute.route_name} />
		</div>
		<div class="action-bar">
			<button on:click={decrementIndex}>Prev.</button>
			<button on:click={incrementIndex}>Next</button>
		</div>
	{/if}
</Modal>

<style>
	.image {
		width: 100%;
		max-height: 70vh;
		object-fit: contain;
	}
	.route-details {
		display: flex;
		flex-direction: column;
		text-align: center;
		font-size: 0.8rem;
		padding: 0 0 0.4rem 0;
		width: 100%;
	}
	.route-details > * {
		margin-bottom: 0.2em;
	}
	.image-container {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
	}
	.action-bar {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
