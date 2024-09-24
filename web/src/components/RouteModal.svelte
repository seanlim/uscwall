<script lang="ts">
	import { resolveTag } from '@/helpers';
	import Modal from './Modal.svelte';

	export let showModal = false;
	export let selectedRoute: App.Route;
</script>

<Modal bind:showModal>
	{#if selectedRoute}
		<div class="container">
			<h3>
				{selectedRoute.route_name}
			</h3>
			<img class="image" src={selectedRoute.image_url} alt={selectedRoute.route_name} />
			<span class={`tag ${resolveTag(selectedRoute.grade)}`}>{selectedRoute.grade}</span>
			<small>
				Set by {selectedRoute.setter_name} (@{selectedRoute.setter_handle})
			</small>
		</div>
	{/if}
</Modal>

<style>
  .container {
    color: var(--secondary);
  }
	.image {
		width: 100%;
		object-fit: contain;
	}
</style>
