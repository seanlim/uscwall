<script>
	import { goto } from '$app/navigation';
	import { session } from '../../stores/session';

	const handleSignOut = () => {
		session.update('user', null);
		goto('/');
	};
</script>

{#if $session.user}
	<div class="container">
		<img class="user-picture" src={$session.user?.photoURL} alt="telegram dp" />
		<b>Signed in as @{$session.user?.telegramUsername}</b>
		<button on:click={handleSignOut}>Sign out</button>
	</div>
{:else}
	<div class="container">
		<b>Not signed in</b>
	</div>
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
