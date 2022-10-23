<script lang="ts">
	import { prefetchRoutes } from '$app/navigation';
	import type { PageData } from '../../.svelte-kit/types/src/routes/$types';
	export let data: PageData;
</script>

{#each data.routes as route}
	<p>{route.route_name} - {route.grade}</p>
{/each}
