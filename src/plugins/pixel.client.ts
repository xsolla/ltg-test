export default defineNuxtPlugin((nuxtApp) => {
	const config = nuxtApp.$config;
	if (config.public.ENV === 'production') {
		nuxtApp.hook('app:mounted', () => {
			const script = document.createElement('script');
			script.src = 'https://pixel.longtale.games/pixel/pixel.js?id=PLATFORM';
			script.async = true;
			script.type = 'text/javascript';
			document.body.appendChild(script);
		});
	}
});
