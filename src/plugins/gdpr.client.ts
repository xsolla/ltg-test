import optionalCookies from '@/assets/data/gdpr/optional-cookies.json';
import { isElectron } from '~/utils/platform';
import type { GDPRCookie } from '~/types/gdpr';
import { loadResource } from '~/utils/resources';
import { LTG_PRIVACY_POLICY_URL } from '~/constants/common';
import { GDPR_CONSENT_LOCALSTORAGE_KEY, GDPR_CONSENT_QUERY_PARAMETER_NAME } from '~/constants/gdpr';
import { silentlyPopCurrentUrlQueryParameter } from '~/utils/url';
import { useRegion } from '~/composables/region';

const GPDR_JS_BUNDLE_SRC = '/dists/gdpr/bundle.js';
const GPDR_CSS_BUNDLE_SRC = '/dists/gdpr/bundle.css';

const GDPR_WIDGET_ELEMENT_ID = 'gdpr-consent-form';
const GDPR_WIDGET_CONTAINER_TAG_NAME = 'div';

const gdprWidget = {
	show: () => {},
	close: () => {},
	isInitializationStarted: false,
};

const createGdprWidgetContainer = () => {
	const container = document.createElement(GDPR_WIDGET_CONTAINER_TAG_NAME);
	container.id = GDPR_WIDGET_ELEMENT_ID;

	document.body.appendChild(container);
};

const commonGdprTabConfig = {
	customCookieListUrl: LTG_PRIVACY_POLICY_URL,
};

const onGdprWidgetLoaded = async () => {
	const { $i18n } = useNuxtApp();
	const { getRegion } = useRegion();
	const region = await getRegion();
	window.GDPR.initialize(
		{
			state: {
				customCookieUrl: LTG_PRIVACY_POLICY_URL,
				customPrivacyPolicyUrl: LTG_PRIVACY_POLICY_URL,
				customOptionalCookies: optionalCookies as GDPRCookie[],
			},
			ui: {
				showReturnButton: true,
			},
			settings: {
				useDataProcessing: false,
				countryCode: region,
				tabsConfig: {
					essential: commonGdprTabConfig,
					analytical: commonGdprTabConfig,
					targeting: commonGdprTabConfig,
					functional: commonGdprTabConfig,
				},
			},
			localization: {
				locale: 'en',
				customTranslation: {
					essential_cookies_description: $i18n.t('gdpr.essentialCookiesDescription'),
					analytical_performance_cookies_description: $i18n.t(
						'gdpr.analyticalPerformanceCookiesDescription'
					),
					functional_cookies_description: $i18n.t('gdpr.functionalCookieDescription'),
					targeting_cookies_description: $i18n.t('gdpr.targetingCookieDescription'),
				},
			},
		},
		(error, component) => {
			if (error) {
				return;
			}

			gdprWidget.close = component.close;
			gdprWidget.show = component.show;
		}
	);
};

export default defineNuxtPlugin((nuxtApp) => {
	const route = useRoute();
	if (!isElectron() && !route.path.includes('/metaframe/')) {
		nuxtApp.hook('page:loading:end', () => {
			const queryConsentId = silentlyPopCurrentUrlQueryParameter(
				GDPR_CONSENT_QUERY_PARAMETER_NAME
			);

			if (queryConsentId) {
				localStorage.setItem(GDPR_CONSENT_LOCALSTORAGE_KEY, queryConsentId);
			}

			if (!gdprWidget.isInitializationStarted) {
				gdprWidget.isInitializationStarted = true;

				createGdprWidgetContainer();

				loadResource(GPDR_JS_BUNDLE_SRC, {
					type: 'js',
					onResourceLoaded: onGdprWidgetLoaded,
				});

				loadResource(GPDR_CSS_BUNDLE_SRC, {
					type: 'css',
				});
			}
		});
	}

	return {
		provide: {
			gdpr: gdprWidget,
		},
	};
});
