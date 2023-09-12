import type { Load } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import crypto from 'crypto';

export const load: Load = async ({ url }) => {
	const params = url.searchParams;
	const hash = params.get('hash');
	params.delete('hash');
	params.sort();
	let dataCheckString = '';
	for (const [key, value] of params.entries()) {
		dataCheckString += `${key}=${value}\n`;
	}
	console.info(dataCheckString);
	if (hash == null || dataCheckString == null || env.TELEGRAM_TOKEN == null) {
		console.error('missing params');
	}
	const secretKey = crypto.createHash('sha256').update(env.TELEGRAM_TOKEN);
	const checkHash = crypto
		.createHmac('sha256', secretKey.digest())
		.update(dataCheckString)
		.digest('hex');
	console.info(hash);
	console.info(checkHash);
	if (checkHash === hash) {
		console.info('authed');
	}
};
