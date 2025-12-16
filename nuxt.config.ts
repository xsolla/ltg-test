import { localeCookieKey } from './src/utils/ltg';
const ENV = process.env.ENV;

let LTG_API = process.env.LTG_API;

if (ENV === 'local:prod') {
				LTG_API = process.env.LTG_PROD_API;
} else if (ENV === 'local:stage') {
				LTG_API = process.env.LTG_STAGE_API;
}

export default defineNuxtConfig({
 css: ['@/assets/css/base.scss', '@/assets/font/stylesheet.css', '@/assets/css/amber/app.scss'],
 modules: ['@vueuse/nuxt', '@nuxtjs/i18n', '@nuxt/eslint', '@nuxtjs/device'],
 plugins: ['~/plugins/xsolla-metrika.ts', '~/plugins/directives/click-metrika.ts'],
 srcDir: './src/',
 spaLoadingTemplate: false,

 routeRules: {
					'/profile/**': {
									ssr: false,
									swr: false,
					},
					'/launcher/**': {
									ssr: false,
									swr: false,
					},
	},

 app: {
					head: {
									title: 'LTG Multiverse',
									htmlAttrs: {
													lang: 'en',
									},
									script: [
													{
																	src: 'https://code.jquery.com/jquery-3.6.0.min.js',
																	async: true,
													},
									],
									meta: [
													{ charset: 'utf-8' },
													{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
													{ hid: 'description', name: 'description', content: '' },
													{ name: 'format-detection', content: 'telephone=no' },
													{ name: 'msapplication-TileColor', content: '#535e99' },
													{ name: 'theme-color', content: '#535e99' },
									],
									link: [
													{ rel: 'icon', type: 'image/png', href: '/favicon-16x16.png?v=5' },
													{ rel: 'icon', type: 'image/png', href: '/favicon-32x32.png?v=5' },
													{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=5' },
													{ rel: 'manifest', href: '/site.webmanifest?v=5' },
													{ rel: 'mask-icon', href: '/safari-pinned-tab.png?v=5', color: '#535e99' },
													{ rel: 'shortcut icon', href: '/favicon.ico?v=5' },
													{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
													{
																	rel: 'preconnect',
																	href: 'https://fonts.gstatic.com',
													},
													{
																	rel: 'stylesheet',
																	href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap',
													},
									],
					},
					layoutTransition: {
									name: 'layout',
									mode: 'out-in',
					},
	},

 devtools: { enabled: false },

 postcss: {
					plugins: {
									autoprefixer: {},
					},
	},

 i18n: {
					vueI18n: './i18n.config.ts',
					detectBrowserLanguage: {
									cookieKey: localeCookieKey,
									useCookie: true,
					},
	},

 vue: {
					runtimeCompiler: true,
	},

 runtimeConfig: {
					public: {
									LTG_API,
									LTG_SERVER_SIDE_API: process.env.LTG_SERVER_SIDE_API,
									SHOW_METAFRAME: process.env.SHOW_METAFRAME,
									METAFRAME_URL: process.env.METAFRAME_URL,
									CALLBACK_URL: process.env.CALLBACK_URL,
									LOGIN_PROJECT_ID: process.env.LOGIN_PROJECT_ID,
									LOGIN_WIDGET_PROJECT_ID: process.env.LOGIN_WIDGET_PROJECT_ID,
									SENTRY_DSN: process.env.SENTRY_DSN,
									SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || 'development',
									ZENDESK_URI: process.env.ZENDESK_URI,
									CDN_URL: process.env.CDN_MIRROR,
									ENV,
									METRIKA_BUNDLE: process.env.METRIKA_BUNDLE,
									LAUNCHER_DEEP_LINK: process.env.LAUNCHER_DEEP_LINK,
									METAFRAME_PROJECT_ID: process.env.METAFRAME_PROJECT_ID,
									MERCHANT_ID: process.env.MERCHANT_ID,
									METAFRAME_VERSION: process.env.METAFRAME_VERSION,
									XSOLLA_SERVICE: process.env.XSOLLA_SERVICE,
									PUBLIC_LTG_API: process.env.PUBLIC_LTG_API,
					},
	},

 typescript: {
					typeCheck: true,
					strict: true,
	},

 compatibilityDate: '2025-01-29'
});