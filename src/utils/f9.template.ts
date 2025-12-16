import { F9 } from '@augustjourney/f9';
import type { F9Response } from '@augustjourney/f9';
import { authTokenCookieKey, localeCookieKey } from '@/utils/ltg';
const sentryStatusCodes = [500, 400, 404, 422, 503, 0];

export const getF9PluginInstance = () => {
	const f9 = getF9Instance();

	const headers = getRequestHeaders();

	f9.setHeaders(headers);

	applySentryErrorCodesCapture(f9);

	return f9;
};

function getF9Instance() {
	const config = useRuntimeConfig();
	const basePath = (
		isServer()
			? config.public.LTG_SERVER_SIDE_API || config.public.LTG_API
			: config.public.LTG_API
	) as string;

	return new F9({
		basePath,
	});
}

function getRequestHeaders() {
	const cookieLocale = useCookie(localeCookieKey);
	// Set xsollaToken to all requests from f9 in src/api/index.ts
	const xsollaTokenCookie = useCookie(authTokenCookieKey);
	const xsollaToken = xsollaTokenCookie.value;
	const accessTokenOverride = getAccessTokenOverride();

	return {
		locale: cookieLocale.value || 'en',
		...(xsollaToken && { xsollaToken }),
		...(xsollaToken && { authorization: `Bearer ${xsollaToken}` }),
		...(accessTokenOverride && { accessTokenOverride }),
	};
}

function getAccessTokenOverride() {
	if (isServer()) {
		return null;
	}
	return localStorage.getItem('accessTokenOverride');
}

function applySentryErrorCodesCapture(f9Instance: F9) {
	sentryStatusCodes.forEach((statusCode) => applySentryErrorCapture(statusCode, f9Instance));
}

function applySentryErrorCapture(statusCode: number, f9Instance: F9) {
	const { $sentryCaptureException } = useNuxtApp();
	if (!$sentryCaptureException) {
		return;
	}
	f9Instance.onStatus(statusCode, (result: F9Response) => {
		const user = getUser();
		$sentryCaptureException(new Error(result.$metadata?.requestName), {
			extra: {
				...(result.$metadata || {}),
				user: user || null,
			},
		});
		return result;
	});
}

// todo rm user from localStorage, extract subject from metaframe token instead
function getUser() {
	if (isServer()) {
		return null;
	}
	const userString = localStorage.getItem('user');
	if (!userString) {
		return null;
	}
	return JSON.parse(userString);
}

function isServer() {
	return typeof window === 'undefined';
}
