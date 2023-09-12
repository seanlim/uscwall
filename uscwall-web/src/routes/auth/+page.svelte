<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '../../stores/session';
	import { onMount } from 'svelte';

	export let data: {
		auth: boolean;
		username?: string;
		photoURL?: string;
	};

	onMount(() => {
		if (data.auth) {
			session.update('user', {
				telegramUsername: data.username,
				photoURL: data.photoURL
			});
			setTimeout(() => goto('/'), 2000);
		}
	});
</script>

{#if data.auth === true}
	<div class="container ">
		<img class="user-picture" src={data.photoURL} alt="telegram dp" />
		<b>Signed in successfully as @{data.username}</b>
	</div>
{:else}
	<h1>Authentication Error</h1>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}
	.container > * {
		margin-bottom: 1rem;
	}
	.user-picture {
		border-radius: 50%;
		width: 5rem;
		height: 5rem;
	}
</style>
