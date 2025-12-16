import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import * as Sentry from '@sentry/vue';
import type { Router } from 'vue-router';

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	Sentry.init({
		enabled: true,
		app: nuxtApp.vueApp,
		autoSessionTracking: true,
		dsn: config.public.SENTRY_DSN,
		environment: config.public.ENV,
		integrations: [
			new Sentry.BrowserTracing({
				routingInstrumentation: Sentry.vueRouterInstrumentation(nuxtApp.$router as Router),
			}),
			new Sentry.Replay(),
		],
		trackComponents: true,
		hooks: ['activate', 'create', 'destroy', 'mount', 'update'],
		tracesSampleRate: 0.2,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1,
	});

	return {
		provide: {
			sentrySetContext: Sentry.setContext,
			sentrySetUser: Sentry.setUser,
			sentrySetTag: Sentry.setTag,
			sentryAddBreadcrumb: Sentry.addBreadcrumb,
			sentryCaptureException: Sentry.captureException,
		},
	};
});
