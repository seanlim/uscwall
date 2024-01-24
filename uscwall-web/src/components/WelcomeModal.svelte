<script lang="ts">
	import { session } from '../stores/session';
	import Modal from './Modal.svelte';
	import RouteGuide from './RouteGuide.svelte';
	export let showModal: boolean;

	const handleCheckboxChanged = (e: any) => {
		session.update('showWelcome', !e.target.checked);
	};
</script>

<Modal bind:showModal>
	<h3>👋 Welcome!</h3>
	<p>
		This site shows boulder routes for the NUS USC boulder wall. Routes displayed on this site are
		crowdsourced and curated by the <a href="https://www.nusclimb.com/">NUS Climbing Club</a>.
	</p>
	<h3>Where is the bouldering wall?</h3>
	<p>
		The bouldering wall is free to use, and is located at the
		<a href="https://goo.gl/maps/DDyUjoycxye1q8r28"> University Sports Centre of NUS</a>.
	</p>
	<h3>How do I submit Routes?</h3>
	<RouteGuide />
	<div class="dns-container">
		<input
			id="dns-checkbox"
			type="checkbox"
			checked={!$session.showWelcome}
			on:change={handleCheckboxChanged}
		/>
		<label for="dns-checkbox">Don't show this on launch anymore</label>
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
