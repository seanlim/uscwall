<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { PUBLIC_HOSTNAME } from '$env/static/public';

	const handleLogoClick = () => {
		goto(`${base}/`);
	};
</script>

<nav aria-label="main navigation">
	<div class="logo-button" on:click={handleLogoClick} on:keydown={handleLogoClick}>
		<img class="logo" src={`${PUBLIC_HOSTNAME}/logo.webp`} alt="logo" />
		<h3>NUS USC Wall</h3>
	</div>
	<a href={`${base}/about`}>About</a>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.3);
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
</style>
