<script lang="ts">
	import { getTelegramUsername, resolveTag } from '@/helpers';
	import Modal from './Modal.svelte';
	import { sendRequest } from '@/apiClient';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';

	export let showModal = false;
	export let routes: Readable<Route[]>;
	export let selectedIndex: number;
	export let isRouteSent = false;
	export const ascents: Writable<Set<string>> = writable(new Set([]));

	$: selectedRoute = $routes[selectedIndex];

	const incrementIndex = () => {
		selectedIndex += 1;
		cycle();
	};
	const decrementIndex = () => {
		selectedIndex -= 1;
		cycle();
	};
	const cycle = () => {
		selectedIndex = ((selectedIndex % $routes.length) + $routes.length) % $routes.length;
	};

	const logAscent = async (isFlash: boolean = false, grade: Grade = selectedRoute.grade) => {
		sendRequest('/ascent', 'POST', {
			route_id: selectedRoute.id,
			username: getTelegramUsername(),
			is_flash: isFlash,
			grade,
			date_created: new Date()
		});
		ascents.update((a) => a.add(selectedRoute.id) && a);
	};

	const unSend = async () => {
		sendRequest('/ascent', 'DELETE', {
			route_id: selectedRoute.id,
			username: getTelegramUsername(),
			date_created: new Date()
		});
		ascents.update((a) => a.delete(selectedRoute.id) && a);
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

			<button class="float-left nav-icon-button" on:click={decrementIndex}>&#10094;</button>
			<button class="float-right nav-icon-button" on:click={incrementIndex}>&#10095;</button>
		</div>

		<div class="action-bar">
			{#if $ascents.has(selectedRoute.id)}
				<button on:click={() => unSend()}>❌ Mark as not sent</button>
			{:else}
				<button on:click={() => logAscent()}>✅ Sent</button>
				<button on:click={() => logAscent(true)}>⚡ ️Flashed</button>
			{/if}
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
		justify-content: center;
	}

	.action-bar > *:nth-child(n + 2) {
		margin-left: 10px;
	}

	button {
		font-size: 1.2rem;
	}
	.nav-icon-button {
		font-size: 2rem;
		background: none;
		color: var(--secondary);
	}
	.nav-icon-button:active {
		opacity: 0.3;
	}

	.float-left {
		position: absolute;
		top: 40%;
		left: 0.5rem;
	}

	.float-right {
		top: 40%;
		position: absolute;
		float: right;
		right: 0.5rem;
	}
</style>
