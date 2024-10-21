import {
	buildAscent,
	getAscentsSheetRows,
	updateAscent,
	logNewAscent,
	unSendRoute
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
		return new Response('Updated', { status: 201 });
	}

	// If the user does not yet have an ascent, we insert a new record
	await logNewAscent(ascent);

	return new Response('OK', { status: 200 });
};

export const GET = async () => {
	const sheetsAscentRows = await getAscentsSheetRows();
	const ascents = sheetsAscentRows?.map(buildAscent);
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
		// If the user does not yet have an ascent, we insert a new record
		await unSendRoute(ascentIndex);
		return new Response('Updated', { status: 201 });
	}

	return new Response('OK', { status: 200 });
};
