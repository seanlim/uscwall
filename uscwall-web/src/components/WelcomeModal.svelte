<script lang="ts">
	import { session } from '../stores/session';
	import Modal from './Modal.svelte';
	export let showModal: boolean;

	const handleCheckboxChanged = (e: any) => {
		session.update('showWelcome', !e.target.checked);
	};
</script>

<Modal bind:showModal>
	<b>👋 Welcome!</b>
	<p>
		This site shows boulder routes for the NUS USC boulder wall. Routes displayed on this site are
		crowdsourced and curated by <a href="https://www.nusclimb.com/">NUS Climbing</a>. The bouldering
		wall is located at the
		<a href="https://goo.gl/maps/DDyUjoycxye1q8r28"> University Sports Centre of NUS</a>.
	</p>
	<b>🧗‍♀️Submitting Routes</b>
	<p>
		To submit your own routes, report issues with the wall, or submit feedback, please use the <a
			href="https://t.me/USCTelebot">USCTelebot</a
		>.
	</p>
	<footer>
		<small>
			For nerds: source can be found on
			<a href="https://github.com/seanlim/uscwall">github.com/seanlim/uscwall</a>.
		</small>
	</footer>
	<div class="dns-container">
		<input
			id="dns-checkbox"
			type="checkbox"
			checked={!$session.showWelcome}
			on:change={handleCheckboxChanged}
		/>
		<label for="dns-checkbox">Don't show on launch</label>
	</div>
</Modal>

<style>
	.dns-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-top: 1rem;
	}
	.dns-container > * {
		margin-right: 0.3rem;
	}
</style>
