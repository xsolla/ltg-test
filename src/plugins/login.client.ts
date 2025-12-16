export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.hook('app:mounted', () => {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = 'https://login-sdk.xsolla.com/latest/';
		document.head.appendChild(script);
	});
});
