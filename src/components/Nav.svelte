<script>
	import { PUBLIC_HOSTNAME } from '$env/static/public';
</script>

<nav class="navbar p-2 px-3" aria-label="main navigation">
	<div class="navbar-brand">
		<a href="/">
			<div class="navbar-item logo-button">
				<img class="logo mr-2" src={`${PUBLIC_HOSTNAME}/logo.webp`} alt="logo" />
				<h3 class="title is-4">NUS USC Wall</h3>
			</div>
		</a>
	</div>
</nav>

<style>
	.logo {
		object-fit: contain;
		border-radius: 15%;
	}

	.logo-button {
		border-radius: 15px;
		cursor: pointer;
	}
	.logo-button:hover {
		background: #f5f5f5;
	}
</style>
