<script>
	import Nav from '../components/Nav.svelte';
</script>

<div class="container responsive-width">
	<Nav />
	<slot />
</div>

<style global>
	:root {
		--selection: #0091ea;

		--primary-rgb: 255, 255, 255;
		--primary: #ffffff;
		--secondary: #000;
		--gray: #eaeaea;
		--light-gray: #f5f5f5;

		--border-radius: 10px;

		box-sizing: border-box;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--primary-rgb: 0, 0, 0;
			--primary: #000000;
			--secondary: #fff;
			--gray: #ccc;
			--light-gray: #242323;
		}
	}

	body {
		display: flex;
		overflow: hidden;
		height: 100vh;
		margin: 0;
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

	@media screen and (-webkit-min-device-pixel-ratio: 0) {
		/* CSS Statements that only apply on webkit-based browsers (Chrome, Safari, etc.) */
		body {
			height: 100dvh;
		}
	}

	a {
		color: var(--selection);
		text-decoration: underline;
		border-radius: 5px;
	}

	a:active {
		background: var(--light-gray);
	}

	.responsive-width {
		max-width: 500px !important;
	}

	.container {
		flex: 1;
		margin: auto;
		height: 100%;
		max-height: 70rem;
		border-radius: 10px;
		overflow-y: scroll;
		overflow-x: hidden;
		background-color: var(--primary);
	}
	@media only screen and (max-width: 450px) {
		/* Styles here */

		.responsive-width {
			width: 100vw;
		}
		.container {
			border-radius: 0;
		}
	}

	.tag {
		background-color: var(--light-gray);
		border-radius: 5px;
		padding: 0.5rem;
		font-weight: bold;
		font-size: 0.8rem;
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
	.skeleton {
		width: 100%;
		height: 100%;
		background: var(--primary);
		border-radius: 10px;
		display: flex;
		margin-bottom: 20px;
	}

	.skeleton-inner {
		flex: 1;
		min-height: 30px;
		background: var(--light-gray);
		border-radius: 5px;
		animation: loading 1s infinite ease-in;
		margin: 3px;
	}

	@keyframes loading {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	hr {
		border: solid 0.3px var(--gray);
	}

	button {
		padding: 0.5rem 0.4rem;
		border-radius: 10px;
		outline: none;
		border: none;
		background: var(--secondary);
		color: var(--primary);
		font-weight: bold;
		font-size: 0.9rem;
	}
	button:active {
		background: var(--gray);
	}
	button:disabled {
		opacity: 0.5;
	}

	input[type='text'] {
		padding: 0.5rem 0.4rem;
		border: solid 1px var(--light-gray);
		outline: none;
	}
</style>
