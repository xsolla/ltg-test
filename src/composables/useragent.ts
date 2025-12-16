import { useRequestHeaders } from '#app';

export const useUseragent = () => {
	const requestHeaders = useRequestHeaders();

	const useragent =
		typeof window?.navigator !== 'undefined'
			? window.navigator.userAgent
			: (requestHeaders['user-agent'] as string | undefined);

	return {
		useragent,
	};
};
