import { useState, useNuxtApp } from 'nuxt/app';
import { ref, watch, computed } from 'vue';
import {
	NEWSLETTER_CONSENT_NEXT_DISPLAY_TIME_LOCALSTORAGE_KEY,
	NEWSLETTER_CONSENT_NEXT_DISPLAY_TIME_NEVER,
	NEWSLETTER_CONSENT_REMIND_LATER_TIMEOUT_MS,
} from '~/constants/newsletter-consent';

const setConsentDisplayTime = (time: number) => {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.setItem(NEWSLETTER_CONSENT_NEXT_DISPLAY_TIME_LOCALSTORAGE_KEY, time.toString());
};

const getConsentDisplayTime = () => {
	if (typeof window === 'undefined') {
		return null;
	}
	const rawItem = localStorage.getItem(NEWSLETTER_CONSENT_NEXT_DISPLAY_TIME_LOCALSTORAGE_KEY);

	if (rawItem) {
		return parseInt(rawItem);
	}

	return null;
};

const isVisible = ref(false);
const userHasCreatedConsent = ref<boolean | null>(null);

export const useNewsletterConsent = (shouldCheckForConsentExistence?: boolean) => {
	const { $api } = useNuxtApp();
	const user = useState('user');

	const localStorageNextDisplayTime = getConsentDisplayTime();

	const currentDateIsGreaterThanNextDisplayTime = localStorageNextDisplayTime
		? new Date().getTime() > new Date(localStorageNextDisplayTime).getTime()
		: false;

	const consentIsAlreadySavedLocally =
		localStorageNextDisplayTime === NEWSLETTER_CONSENT_NEXT_DISPLAY_TIME_NEVER;

	const shouldConsentBeDisplayed = computed(() => {
		return (
			!localStorageNextDisplayTime ||
			(!consentIsAlreadySavedLocally && currentDateIsGreaterThanNextDisplayTime) ||
			(consentIsAlreadySavedLocally && user.value)
		);
	});

	const handleConsentCreationCheck = (currentUserValue: unknown, oldUserValue: unknown) => {
		if (!shouldCheckForConsentExistence) {
			return;
		}

		const userJustLoggedIn = Boolean(currentUserValue) && !oldUserValue;

		if (userJustLoggedIn) {
			$api.checkNewsletterConsent().then(({ exists: consentAlreadyCreated }) => {
				userHasCreatedConsent.value = consentAlreadyCreated;
			});
		}
	};

	const handleConsentVisibility = () => {
		if (!isVisible.value && shouldConsentBeDisplayed.value && !userHasCreatedConsent.value) {
			isVisible.value = true;
		} else if (userHasCreatedConsent.value) {
			isVisible.value = false;
		}
	};

	watch(userHasCreatedConsent, handleConsentVisibility, { immediate: true });

	watch(user, handleConsentCreationCheck, {
		immediate: true,
	});

	const remindLater = () => {
		isVisible.value = false;

		const nextDisplayTime = new Date().getTime() + NEWSLETTER_CONSENT_REMIND_LATER_TIMEOUT_MS;
		setConsentDisplayTime(nextDisplayTime);
	};

	const createConsent = async (email: string, source: string) => {
		userHasCreatedConsent.value = true;

		await $api.createNewsletterConsent({
			email,
			source,
			isAccepted: true,
		});

		setConsentDisplayTime(NEWSLETTER_CONSENT_NEXT_DISPLAY_TIME_NEVER);
	};

	const declineConsent = async (options?: { email: string; source: string }) => {
		isVisible.value = false;

		if (options) {
			const { email, source } = options;

			await $api.createNewsletterConsent({
				email,
				source,
				isAccepted: false,
			});
		}

		setConsentDisplayTime(NEWSLETTER_CONSENT_NEXT_DISPLAY_TIME_NEVER);
	};

	return {
		isVisible,
		remindLater,
		createConsent,
		declineConsent,
	};
};
