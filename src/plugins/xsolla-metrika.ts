import { pageEvents, siteDomains } from '~/utils/metrika';

export default defineNuxtPlugin((nuxtApp) => {
	const router = useRouter();
	// if (nuxtApp.$config.public.ENV !== 'production') return;
	nuxtApp.hook('app:mounted', () => {
		const script = document.createElement('script');
		script.src = nuxtApp.$config.public.METRIKA_BUNDLE;
		script.async = true;
		script.type = 'text/javascript';
		script.onload = () => {
			const xsollaAnalyticsInstance = window.XsollaAnalytics({
				id: 300301,
				siteDomains: siteDomains,
				server: `${nuxtApp.$config.public.LTG_API}/v2/xsolla/metrika/hit`,
				scroll: false,
				extLink: false,
			});

			// Visit pages event
			let lastPath = ''; // сделать через валидацию router.beforeEach
			router.afterEach((to, from) => {
				if (lastPath === to?.path) {
					return false;
				} // router push repeat
				lastPath = to.path;
				const page =
					Object.entries(pageEvents).find(([route]) => {
						const re = new RegExp('^' + route.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
						return re.test(to.path);
					})?.[0] ?? '';
				const ev = to?.params?.[pageEvents[page]?.ev ?? ''];
				if (!pageEvents?.[page] || to?.path === from?.path) {
					return;
				}
				xsollaAnalyticsInstance.hit(to.fullPath, {
					en: pageEvents[page].en,
					ev,
				});
			});
			nuxtApp.$xsollaAnalytics = xsollaAnalyticsInstance;
		};
		document.body.appendChild(script);
	});
});
