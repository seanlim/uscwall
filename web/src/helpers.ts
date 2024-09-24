// Resolves grade to Bulma color
export function resolveTag(grade: string) {
	if (grade.includes('V2-V3')) {
		return 'is-easy';
	}
	if (grade.includes('V4-V5')) {
		return 'is-medium';
	}
	if (grade.includes('V6 and beyond')) {
		return 'is-hard';
	}
	if (grade.includes('Wild')) {
		return 'is-wild';
	}
	// defaults to V0
}

export function debug(msg: string) {
	if (process.env.NODE_ENV === 'production') {
		return;
	}
	console.debug(msg);
}
