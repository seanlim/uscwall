<script lang="ts">
	import { session } from '../stores/session';
	import Modal from './Modal.svelte';

	let dialog: HTMLDialogElement;
	export let showModal: boolean;
	export let routeID: string;

	let rating = 5,
		attempts = 'Flashed';
	let loading = false;
	const handleSubmit = async () => {
		loading = true;
		await fetch(
			`/api/logAscent?route_id=${routeID}&username=${
				$session.user?.telegramUsername ?? 'anon'
			}&rating=${rating}&attempts=${attempts}`
		);
		loading = false;
		dialog.close();
	};
</script>

<Modal bind:showModal bind:dialog>
	<div class="container">
		{#if $session.user != null}
			<b>Log Ascent</b>
			<div>
				<label for="rating">Rating:</label>
				<input
					type="number"
					name="rating"
					id="rating"
					min="1"
					max="5"
					bind:value={rating}
					disabled={loading}
				/>
			</div>
			<select bind:value={attempts} disabled={loading}>
				<option value="Flashed">Flashed</option>
				<option value="2 Attempts">2 Attempts</option>
				<option value="3 Attempts">3 Attempts</option>
				<option value="More than 3 Attempts">More than 3 Attempts</option>
			</select>
			<button on:click={handleSubmit} disabled={loading}
				>{loading ? 'Submitting...' : 'Submit'}</button
			>
		{:else}
			<b>Not signed in</b>
			Sign in with Telegram to log ascents!
		{/if}
	</div>
</Modal>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	.container > * {
		margin-bottom: 0.3rem;
	}
</style>
