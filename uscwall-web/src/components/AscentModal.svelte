<script lang="ts">
	import Modal from './Modal.svelte';
	export let showModal: boolean;
	export let routeID: string;
</script>

<Modal bind:showModal>
	<div class="container">
		<b>Log Ascent</b>
		<div>
			<label for="rating">Rating:</label>
			<input type="number" name="rating" id="rating" min="1" max="5" value="5" />
		</div>
		<select value="Flashed">
			<option value="Flashed">Flashed</option>
			<option value="2 Attempts">2 Attempts</option>
			<option value="3 Attempts">3 Attempts</option>
			<option value="More than 3 Attempts">More than 3 Attempts</option>
		</select>
		<button>Submit</button>
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
