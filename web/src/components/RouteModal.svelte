<script lang="ts">
	import { resolveTag } from '@/helpers';
	import Modal from './Modal.svelte';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { sendRequest } from '@/apiClient';

	export let showModal = false;
	export let routes: Route[];
	export let selectedIndex: number;

	let isRouteSent = false;

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

	const logAscent = async (isFlash: boolean = false, grade: Grade = selectedRoute.grade) => {
		sendRequest('/ascent', 'POST', {
			route_id: selectedRoute.id,
			username:
				process.env.NODE_ENV === 'production'
					? Telegram.WebApp.initDataUnsafe.user?.username
					: 'testuser',
			is_flash: isFlash,
			grade,
			date_created: new Date()
		});
	};

	const unSend = async () => {
		sendRequest('/ascent', 'DELETE', {
			route_id: selectedRoute.id,
			username:
				process.env.NODE_ENV === 'production'
					? Telegram.WebApp.initDataUnsafe.user?.username
					: 'testuser',
			date_created: new Date()
		});
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
			{#if isRouteSent}
				<button on:click={() => unSend()}>Mark as Unsent</button>
			{:else}
				<button on:click={() => logAscent()}>Log Ascent</button>
				<button on:click={() => logAscent(true)}>Log Flash</button>
			{/if}
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
