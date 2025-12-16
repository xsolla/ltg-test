export interface GDPR {
	initialize: (params: InitializeGDPRParams, callback?: GDPRInitializeCallback) => void;
}

type GDPRInitializeCallback = (err: Error | null, component: GDPRWidget) => void;

interface GDPRWidget {
	show: VoidFunction;
	close: VoidFunction;
}

interface InitializeGDPRParams {
	state?: StateParams;
	ui?: UIParams;
	settings?: SettingParams;
	localization?: Localization;
}

interface UIParams {
	target?: HTMLElement;
	showReturnButton?: boolean;
}

interface SettingParams {
	dataProcessingUserType?: 'customer' | 'partner';
	countryCode?: string;
	useDataProcessing?: boolean;
	useCookies?: UseCookies | boolean;
	tabsConfig?: TabsConfig;
}

interface TabConfig {
	visible?: boolean;
	customCookieListUrl?: string;
}

type UseCookies = {
	targeting?: boolean;
	functional?: boolean;
	analytical?: boolean;
};

type EssentialCookieTabConfig = Partial<Record<'essential', Omit<TabConfig, 'visible'>>>;
type OptionalCookieTabsConfig = Partial<Record<Exclude<CookieType, 'essential'>, TabConfig>>;

type TabsConfig = OptionalCookieTabsConfig & EssentialCookieTabConfig;

interface StateParams {
	userIdentityType?: string;
	userId?: string;
	productName?: string;
	apiUrl?: string;
	customCookieUrl?: string;
	customPrivacyPolicyUrl?: string;
	customOptionalCookies?: GDPRCookie[];
}

type CookieType = 'essential' | 'analytical' | 'functional' | 'targeting';

export interface GDPRCookie {
	name: string;
	domain?: string;
	path?: string;
	reg?: string;
	type: CookieType;
}

interface Localization {
	locale?: string;
	groupConsentUrl?: string;
	customTranslation?: CustomTranslation;
}

interface CustomTranslation {
	essential_cookies_checkbox?: string;
	essential_cookies_tooltip?: string;
	analytical_performance_cookies_checkbox?: string;
	functional_cookies_checkbox?: string;
	targeting_cookies_checkbox?: string;
	settings_button?: string;
	settings_title?: string;
	settings_footer_description?: string;
	accept_all_button?: string;
	return_button?: string;
	save_and_close_button?: string;
	saving_button?: string;
	welcome_screen_title?: string;
	welcome_screen_description?: string;
	welcome_screen_mobile_description?: string;
	welcome_screen_data_processing?: string;
	welcome_screen_allow_cookies?: string;
	data_processing_consent_checkbox?: string;
	essential_cookies_description?: string;
	essential_cookies_list_link_name?: string;
	analytical_performance_cookies_description?: string;
	analytical_performance_cookies_link_name?: string;
	functional_cookies_description?: string;
	functional_cookies_link_name?: string;
	targeting_cookies_description?: string;
	targeting_cookies_link_name?: string;
	data_processing_consent_description?: string;
	data_processing_consent_my_personal_data?: string;
	data_processing_consent_customer_checkbox_tooltip?: string;
	data_processing_consent_partner_checkbox_tooltip?: string;
	opt_out_title?: string;
	opt_out_description?: string;
	opt_out_consent?: string;
	opt_out_consent_link_name?: string;
	cookie_policy_link_name?: string;
	privacy_policy_link_name?: string;
}
