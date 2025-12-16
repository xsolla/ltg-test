export default async function useXsollaLogin(to = '/') {
	const url = useRequestURL();
	const callbackUrl = `${url.protocol}//${url.host}/access`;
	if (!import.meta.client) {
		return;
	}
	const { Widget } = await import('@xsolla/login-sdk');

	return new Widget({
		projectId: 'b9ae8680-f664-41ce-9c19-5adf5c0044b7',
		callbackUrl: `${callbackUrl}?to=${to}`,
		preferredLocale: 'en',
		customStyle: 'https://longtalegames.com/storage/app/media/uploaded-files/login.widget.css',
	});
}
