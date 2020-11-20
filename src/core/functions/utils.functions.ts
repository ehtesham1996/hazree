/**
 * @param seconds number of seconds to be converted to HH:MM
 * @description This utiltiy function convert the number of seconds to HH:MM format
 */
export function convertSecondToHHMM(seconds = 0): string {
	const hours = Math.floor(seconds / 3600);
	const remainingSeconds = seconds % 3600;
	const minutes = Math.floor(remainingSeconds / 60);
	// eslint-disable-next-line prefer-template
	return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
}

export function timeSince(date): string {
	const seconds = Math.floor((new Date() - date) / 1000);

	let interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + ' years ago';
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + ' months ago';
	}
	interval = seconds / 86400;
	if (interval > 2) {
		return Math.floor(interval) + ' days ago';
	} else if (interval > 0) {
		return 'Yesterday';
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + ' hours ago';
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + ' minutes ago';
	}
	return Math.floor(seconds) + ' seconds ago';
}
