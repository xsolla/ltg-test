export async function useSetAuth(token: string) {
	const xsollaToken = useState<string | undefined>(STATE_KEYS.TOKEN);
	xsollaToken.value = token;
	const { $api, $f9 } = useNuxtApp();

	const cookieLocale = useCookie(localeCookieKey);

	$f9.setHeaders({
		locale: cookieLocale.value || 'en',
		xsollaToken: token,
		authorization: `Bearer ${token}`,
	});
	// TODO: when metaframe will support 'refresh' event, uncomment further lines
	// const expires = new Date(getJwtBodyFromToken(token).exp * 1000);
	// document.cookie = `${authTokenCookieKey}=${token}; expires=${expires.toUTCString()}; path=/`;

	const data = await $api.signup({
		ltg_code: useCookie('ltg_code').value || '',
		xsollaToken: token,
	});

	if (!data.success) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Something went wrong while trying to log in',
			fatal: true,
		});
	}
	// @ts-expect-error

	if (data.data.is_registration && typeof gtag !== 'undefined') {
		// @ts-expect-error

		gtag('event', 'registration');
	}

	const user = await useSetUser();

	localStorage.setItem('user', JSON.stringify(user));

	const [forumSession, zendeskSession] = await Promise.all([
		$api.getForumSession(),
		$api.getSSOJWT('zendesk', cookieLocale.value || 'en'),
	]);
	if (zendeskSession?.success) {
		if (document) {
			document.cookie = `zendesk_session=${zendeskSession.data};`;
		}
	}
	if (forumSession) {
		if (document) {
			document.cookie = `flarum_session=${forumSession};expires=7200;domain=.ltg.com;path=/`;
		}
	}
}
