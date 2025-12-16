import { authTokenCookieKey } from '~/utils/ltg';

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (process.client) {
		if (to.query.token) {
			await useSetAuth(to.query.token?.toString());
		}
	}
});
