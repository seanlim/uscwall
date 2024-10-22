import {
	buildAscent,
	getAscentsSheetRows,
	updateAscent,
	logNewAscent,
	unSendRoute,
	DEFAULT_CACHE_CONTROL_HEADER
} from '@/apiHelpers';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const ascent: Ascent = await request.json();

	if (!ascent || !ascent.route_id || !ascent.username) {
		return new Response('Invalid request body', {
			status: 400
		});
	}

	const { username } = ascent;

	// Check if the user already has an ascent for this route.
	const ascentRows = await getAscentsSheetRows();

	const ascentIndex = ascentRows?.findIndex((r) => r[1] == username && r[0] == ascent.route_id);

	if (ascentIndex && ascentIndex !== -1) {
		// If the user does not yet have an ascent, we insert a new record
		await updateAscent(ascentIndex, ascent);
		return json({ message: 'Updated' }, { status: 200 });
	}

	// If the user does not yet have an ascent, we insert a new record
	await logNewAscent(ascent);

	return json({ message: 'OK' }, { status: 200 });
};

export const GET = async ({ url, setHeaders }) => {
	setHeaders({
		...DEFAULT_CACHE_CONTROL_HEADER
	});

	const routeIDQuery = url.searchParams.get('route_id');
	const usernameQuery = url.searchParams.get('username');

	const sheetsAscentRows = await getAscentsSheetRows();
	let ascents = sheetsAscentRows?.map(buildAscent);

	// query
	if (routeIDQuery != null && routeIDQuery !== '') {
		ascents = ascents?.filter((a) => a.route_id === routeIDQuery);
	}
	if (usernameQuery != null && usernameQuery !== '') {
		ascents = ascents?.filter((a) => a.username === usernameQuery);
	}

	return json({
		ascents
	});
};

export const DELETE = async ({ request }) => {
	const ascent: Ascent = await request.json();

	const ascentRows = await getAscentsSheetRows();

	const ascentIndex = ascentRows?.findIndex(
		(r) => r[1] == ascent.username && r[0] == ascent.route_id
	);

	if (ascentIndex && ascentIndex !== -1) {
		await unSendRoute(ascentIndex);
		return json({ message: 'Updated ' }, { status: 200 });
	}

	// Ignore if no ascent
	return json({ message: 'OK' }, { status: 200 });
};
