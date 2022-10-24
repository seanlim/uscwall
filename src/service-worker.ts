const CACHE_NAME = 'uscwall-cache';

const TWO_HOURS_IN_MILLISECONDS = 1000 * 60 * 60 * 2;
const isValid = function (response) {
	if (!response) return false;
	let fetched = response.headers.get('sw-fetched-on');
	if (fetched && parseFloat(fetched) + TWO_HOURS_IN_MILLISECONDS > new Date().getTime())
		return true;
	return false;
};

self.addEventListener('fetch', (event) => {
	// skip requests for extensions
	if (!(event.request.url.indexOf('http') === 0)) return;

	if (event.request.url.includes('/api/routes')) {
		event.respondWith(
			caches.match(event.request).then((response) => {
				if (isValid(response)) {
					// Cache hit - return response
					return response;
				}

				return fetch(event.request).then((response) => {
					// Check if we received a valid response
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					// IMPORTANT: Clone the response. A response is a stream
					// and because we want the browser to consume the response
					// as well as the cache consuming the response, we need
					// to clone it so we have two streams.
					const responseToCache = response.clone();
					const headers = new Headers(responseToCache.headers);
					headers.append('sw-fetched-on', new Date().getTime().toString());

					caches.open(CACHE_NAME).then((cache) => {
						responseToCache.blob().then((body) => {
							cache.put(
								event.request,
								new Response(body, {
									status: responseToCache.status,
									statusText: responseToCache.statusText,
									headers
								})
							);
						});
					});
					return response;
				});
			})
		);
	}
});

export {};
