import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { insertIntoSheet } from '../../../apiHelpers';
import type { RequestHandler } from './$types';

const SHEET_ASCENTS = 'ascentsNEW';

export const GET: RequestHandler = async ({ url }) => {
	const routeID = url.searchParams.get('route_id');
	const username = url.searchParams.get('username');
	const rating = url.searchParams.get('rating');
	const noOfAttempts = url.searchParams.get('attempts');

	// TODO: check if route exists
	// TODO: increment ascent counter
	// insert into ascent sheet
	await insertIntoSheet(SHEET_ASCENTS, [[routeID, username, noOfAttempts, rating, new Date()]]);

	return json({ ok: true });
};
