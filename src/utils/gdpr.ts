import { GDPR_CONSENT_LOCALSTORAGE_KEY, GDPR_CONSENT_QUERY_PARAMETER_NAME } from '~/constants/gdpr';

export const getGDPRSeamlessLink = (originalLink: string) => {
	const consentId = localStorage.getItem(GDPR_CONSENT_LOCALSTORAGE_KEY);

	if (consentId) {
		const url = new URL(originalLink);

		url.searchParams.set(GDPR_CONSENT_QUERY_PARAMETER_NAME, consentId);

		return url.toString();
	}

	return originalLink;
};
