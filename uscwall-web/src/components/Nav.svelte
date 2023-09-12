<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import { onMount } from 'svelte';
	import WelcomeModal from './WelcomeModal.svelte';
	import { session } from '../stores/session';
	import TelegramLogin from './TelegramLogin.svelte';
	import { env } from '$env/dynamic/private';

	const handleLogoClick = () => {
		goto(`${base}/`);
	};

	let showWelcomeModal = false;

	const handleAboutClick = (e: Event) => {
		e.preventDefault();
		showWelcomeModal = true;
	};

	onMount(() => {
		if ($session.showWelcome) {
			showWelcomeModal = true;
		}
	});
</script>

<nav aria-label="main navigation">
	<div class="logo-button" on:click={handleLogoClick} on:keydown={handleLogoClick}>
		<img class="logo" src={`${PUBLIC_HOSTNAME}/logo.webp`} alt="logo" />
		<h3>NUS USC Wall</h3>
	</div>
	<div class="right-container">
		<a href="/" on:click={handleAboutClick}>About</a>
		<TelegramLogin username={env.TELEGRAM_BOT_USERNAME} authType="redirect" redirectURL="/auth" />
	</div>
</nav>
<WelcomeModal bind:showModal={showWelcomeModal} />

<style>
	nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		background: rgba(var(--primary-rgb), 0.7);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		border-bottom: 1px solid var(--gray);
		z-index: 999;

		position: sticky;
		top: 0;
	}

	.logo {
		width: 2rem;
		height: 2rem;
		object-fit: contain;
		margin-right: 0.5rem;
		border-radius: 0.3rem;
	}

	.logo-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
	}
	.logo-button:active {
		opacity: 0.5;
	}

	.right-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.right-container > * {
		margin-right: 0.4rem;
	}
</style>
