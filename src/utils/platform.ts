export const isMac = (useragent?: string) => {
	return useragent?.toLowerCase().includes('mac');
};

export const isElectron = () => {
	if (typeof window?.navigator === 'undefined') {
		return false;
	}
	return window.navigator.userAgent.toLowerCase().includes('electron');
};

export default {
	isMac,
	isElectron,
};
