<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { PUBLIC_HOSTNAME, PUBLIC_TELEGRAM_BOT_USERNAME } from '$env/static/public';
	import { onMount } from 'svelte';
	import WelcomeModal from './WelcomeModal.svelte';
	import { session } from '../stores/session';
	import TelegramLogin from './TelegramLogin.svelte';
	import { page } from '$app/stores';

	const handleLogoClick = () => {
		if ($page.url.pathname === '/') {
			showWelcomeModal = true;
			return;
		}
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
		{#if $session.user == null}
			<TelegramLogin
				username={PUBLIC_TELEGRAM_BOT_USERNAME}
				authType="redirect"
				redirectURL="/auth"
			/>
		{:else}
			<a href="/me" data-sveltekit-preload-data="hover">
				<img class="avatar-img" src={$session.user.photoURL} alt="telegram dp" />
			</a>
		{/if}
	</div>
</nav>
<WelcomeModal bind:showModal={showWelcomeModal} />

<style>
	nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0.3rem;
		background: rgba(var(--primary-rgb), 0.7);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		border-bottom: 1px solid var(--gray);
		z-index: 999;

		position: sticky;
		top: 0;
		height: 3rem;
	}

	.logo {
		width: 1.5rem;
		height: 1.5rem;
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
	.avatar-img {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
	}
</style>
