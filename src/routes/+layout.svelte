<script>
	import Nav from '../components/Nav.svelte';
</script>

<div class="container is-flex is-flex-direction-column">
	<Nav />
	<slot />
</div>

<style global>
	:root {
		--selection: #0091ea;

		--primary: #fff;
		--secondary: #000;
		--gray: #eaeaea;
		--light-gray: #f5f5f5;

		--border-radius: 10px;

		box-sizing: border-box;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--primary: #000;
			--secondary: #fff;
			--gray: #ccc;
			--light-gray: #242323;
		}
	}
	body {
		display: flex;
		overflow: hidden;
		height: 100vh;
		padding-bottom: env(safe-area-inset-bottom);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
			'Cantarell', 'Fira Sans', 'Droid Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light',
			'Helvetica Neue', Helvetica, Arial, sans-serif;
		text-rendering: geometricPrecision;
		line-height: auto;
		-webkit-font-smoothing: antialiased;

		background-color: var(--light-gray);
		color: var(--secondary);
	}

	a {
		color: var(--selection);
		text-decoration: underline;
		border-radius: 5px;
	}

	a:active {
		background: var(--light-gray);
	}

	.container {
		flex: 1;
		margin: auto;
		max-width: 500px !important;
		height: 100%;
		max-height: 70rem;
		border-radius: 10px;
		overflow-y: scroll;
		background-color: var(--primary);
	}

	.tag {
		background-color: var(--light-gray);
		border-radius: 5px;
		padding: 0.5rem;
		font-weight: bold;
	}

	.tag.is-easy {
		color: #3ec300;
	}
	.tag.is-medium {
		color: #337ca0;
	}

	.tag.is-hard {
		color: #ff1d15;
	}
</style>
