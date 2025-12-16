// https://github.com/ellisonleao/sharer.js
export type DeepLinkPayload = {
	subject?: string;
	payload: string;
	callback?: VoidFunction;
};

export const handleCopyLink = ({ payload, callback }: DeepLinkPayload) => {
	navigator.clipboard.writeText(payload).catch(console.error);
	if (callback) {
		callback();
	}
};

export const handleFacebook = ({ payload, callback }: DeepLinkPayload) => {
	const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
		window.location.href
	)}&quote=${encodeURIComponent(payload)}`;
	window.open(url, '_blank')?.focus();
	if (callback) {
		callback();
	}
};

export const handleTwitter = ({ payload, callback }: DeepLinkPayload) => {
	const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload)}`;
	window.open(url, '_blank')?.focus();
	if (callback) {
		callback();
	}
};

export const handleReddit = ({ payload, callback }: DeepLinkPayload) => {
	const url = `https://www.reddit.com/submit?url=${encodeURIComponent(
		window.location.href
	)}&title=${encodeURIComponent(payload)}`;
	window.open(url, '_blank')?.focus();
	if (callback) {
		callback();
	}
};

export const handleTelegram = ({ payload, callback }: DeepLinkPayload) => {
	const url = `https://t.me/share/url?url=${encodeURIComponent(
		window.location.href
	)}&text=${encodeURIComponent(payload)}`;
	window.open(url, '_blank')?.focus();
	if (callback) {
		callback();
	}
};

export const handleWhatsApp = ({ payload, callback }: DeepLinkPayload) => {
	const useWebVersion = false;
	const shareUrlBase = useWebVersion ? 'https://web.whatsapp.com/send' : 'https://wa.me/';
	const url = `${shareUrlBase}?text=${encodeURIComponent(payload)}`;
	window.open(url, '_blank')?.focus();
	if (callback) {
		callback();
	}
};

export const handleEmail = ({ subject, payload, callback }: DeepLinkPayload) => {
	// todo add subject to email form in admin panel
	const url =
		'mailto:?subject=' +
		encodeURIComponent(subject || '') +
		'&body=' +
		encodeURIComponent(payload);
	window.open(url, '_blank')?.focus();
	if (callback) {
		callback();
	}
};
