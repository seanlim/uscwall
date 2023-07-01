// Resolves grade to Bulma color
export function resolveTag(grade: string) {
	if (grade.includes('V2-V3')) {
		return 'is-easy';
	}
	if (grade.includes('V4-V5')) {
		return 'is-medium';
	} else if (grade.includes('V5')) {
		return 'is-hard';
	}
	// defaults to V0
}

export function debug(msg: string) {
	if (process.env.NODE_ENV === 'production') {
		return;
	}
	console.debug(msg);
}
