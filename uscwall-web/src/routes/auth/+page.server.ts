import type { Load } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'crypto';

export const load: Load = async ({ url }) => {
	const params = url.searchParams;
	const hash = params.get('hash');
	params.delete('hash');
	params.sort();

	const a: string[] = [];
	for (const [key, value] of params.entries()) {
		a.push(`${key}=${value}`);
	}
	const dataCheckString = a.join('\n');

	if (hash == null || dataCheckString == null || env.TELEGRAM_TOKEN == null) {
		return {
			auth: false
		};
	}

	const secretKey = crypto.createHash('sha256').update(env.TELEGRAM_TOKEN);
	const checkHash = crypto
		.createHmac('sha256', secretKey.digest())
		.update(dataCheckString)
		.digest('hex');

	if (checkHash === hash) {
		return {
			auth: true,
			username: params.get('username'),
			photoURL: params.get('photo_url')
		};
	}
	return {
		auth: false
	};
};
