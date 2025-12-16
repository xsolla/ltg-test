export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.hook('app:mounted', () => {
		const script = document.createElement('script');
		script.src = 'https://cdn.xsolla.net/embed/paystation/1.3.0/widget.min.js';
		script.async = true;
		script.type = 'text/javascript';
		document.body.appendChild(script);
	});
});
