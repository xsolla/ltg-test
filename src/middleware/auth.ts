import { authTokenCookieKey } from '~/utils/ltg';

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (process.client) {
		const xsollaToken = useCookie(authTokenCookieKey).value;

		if (xsollaToken) {
			await useSetAuth(xsollaToken);
		} else if (to.query.xsollaUserId) {
			const { $api } = useNuxtApp();
			const xsollaToken = await $api.getXsollaToken(to.query.xsollaUserId?.toString());
			if (xsollaToken) {
				await useSetAuth(xsollaToken);
			}
		} else {
			return await navigateTo('/?action=login');
		}
	}
});
