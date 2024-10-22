import { PUBLIC_HOSTNAME } from '$env/static/public';
import type { HttpMethod } from '@sveltejs/kit';

export type APIPath = '/ascent' | '/routes';

export async function sendRequest(path: APIPath, method: HttpMethod, body: object = {}) {
	const res = await fetch(`${PUBLIC_HOSTNAME}/api${path}`, {
		method: method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw new Error('Error while sending request');
	}
	return await res.json();
}
