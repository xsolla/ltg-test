export default defineNuxtPlugin((nuxtApp) => {
	const config = nuxtApp.$config;
	if (config.public.ENV === 'production') {
		nuxtApp.hook('app:mounted', () => {
			const TAG_ID = 'GTM-TXNZV6Q';
			const script = document.createElement('script');
			script.src = `https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
			// @ts-ignore
			window.dataLayer = window.dataLayer || [];

			function gtag() {
				// @ts-ignore
				// eslint-disable-next-line
				dataLayer.push(arguments);
			}

			// @ts-ignore
			gtag('js', new Date());
			// @ts-ignore
			gtag('config', TAG_ID);
		});
	}
});
