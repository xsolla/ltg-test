import { useWindowSize } from '@vueuse/core';
import { useNuxtApp } from 'nuxt/app';
import { computed } from 'vue';
import { useRequestHeaders } from '#app';
import type { SecChUaPlatformHeader } from '~/types';

const MIN_TABLET_WIDTH_BREAKPOINT = 769;
const MIN_DESKTOP_WIDTH_BREAKPOINT = 1100;

export default function useMobileTablet() {
	const { width } = useWindowSize();
	const { $device } = useNuxtApp();
	const requestHeaders = useRequestHeaders();

	const hasWidth = computed(() => width.value !== Infinity);

	const requestPlatform = computed(() => {
		return requestHeaders['sec-ch-ua-platform'] as SecChUaPlatformHeader | undefined;
	});

	const desktop = computed(() => {
		const requestPlatformIsDesktop =
			requestPlatform.value === '"Linux"' ||
			requestPlatform.value === '"Windows"' ||
			requestPlatform.value === '"macOS"';

		return hasWidth.value
			? width.value >= MIN_DESKTOP_WIDTH_BREAKPOINT
			: requestPlatformIsDesktop || $device.isDesktop;
	});

	const tablet = computed(() => {
		const requestPlatformIsTablet =
			requestPlatform.value === '"iOS"' || requestPlatform.value === '"Android"';

		return hasWidth.value
			? width.value >= MIN_TABLET_WIDTH_BREAKPOINT &&
					width.value < MIN_DESKTOP_WIDTH_BREAKPOINT
			: (requestPlatformIsTablet || $device.isTablet) && !$device.isDesktop;
	});

	const mobile = computed(() => {
		const requestPlatformIsMobile =
			requestPlatform.value === '"iOS"' || requestPlatform.value === '"Android"';

		return hasWidth.value
			? width.value < MIN_TABLET_WIDTH_BREAKPOINT
			: (requestPlatformIsMobile || $device.isMobile) &&
					!$device.isTablet &&
					!$device.isDesktop;
	});

	return { mobile, tablet, desktop };
}
