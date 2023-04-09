<script>
	import { base } from '$app/paths';
	import { PUBLIC_HOSTNAME } from '$env/static/public';
</script>

<nav aria-label="main navigation">
	<a href={`${base}/`}>
		<div class="navbar-item logo-button">
			<img class="logo" src={`${PUBLIC_HOSTNAME}/logo.webp`} alt="logo" />
			<h3 class="title is-4">NUS USC Wall</h3>
		</div>
	</a>
	<a href="/about">About</a>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem;
		background-color: white;
		z-index: 999;

		position: sticky;
		top: 0;
	}

	.logo {
		width: 2rem;
		object-fit: contain;
		margin-right: 0.5rem;
		border-radius: 15%;
	}

	.logo-button {
		display: flex;
		flex-direction: row;
		border-radius: 15px;
		cursor: pointer;
	}
	.logo-button:hover {
		background: #f5f5f5;
	}
</style>
