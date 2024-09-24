import { fileURLToPath, URL } from 'url';
import { sveltekit } from '@sveltejs/kit/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit(), tsconfigPaths()],
	server: {
		host: process.env.PUBLIC_HOSTNAME
	},
	resolve: {
		alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }]
	}
};

export default config;
