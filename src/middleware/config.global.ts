import { useSetUser } from '~/composables/user';
import { useSetCurrency } from '~/composables/currency';
import { useTechWorks } from '~/composables/tech-works';
import { authTokenCookieKey } from '~/utils/ltg';

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.client && !to.path.includes('logout') && !to.path.includes('/metaframe/')) {
		if (useCookie(authTokenCookieKey).value) {
			await useSetUser();
		}
		await useSetCurrency();

		const user = useState<{
			data: {
				admin: boolean;
			};
		}>('user');
		const techWorksOn = await useTechWorks();
		if (techWorksOn && to.name !== 'tech-works' && !user?.value?.data?.admin) {
			return navigateTo('/tech-works', { redirectCode: 302 });
		}
	}
});
