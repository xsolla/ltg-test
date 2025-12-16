import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';
type BackgroundImageValue =
	| string
	| {
			mobile?: string;
			desktop?: string;
			tablet?: string;
	  };

interface BackgroundImageModifiers {
	cover?: boolean;
	center?: boolean;
	noRepeat?: boolean;
}

export const backgroundImage = {
	mounted(
		el: HTMLElement,
		binding: { value: BackgroundImageValue; modifiers: BackgroundImageModifiers }
	) {
		const { value, modifiers } = binding;

		if (modifiers.cover) {
			el.style.backgroundSize = 'cover';
		}

		if (modifiers.center) {
			el.style.backgroundPosition = 'center center';
		}

		if (modifiers.noRepeat) {
			el.style.backgroundRepeat = 'no-repeat';
		}

		if (typeof value === 'string' && value !== '') {
			el.style.backgroundImage = `url("${binding.value}")`;
			return;
		}

		if (typeof value !== 'object') {
			return;
		}

		const { mobile, desktop, tablet } = value;

		if (!mobile && !desktop && !tablet) {
			return;
		}

		const isDesktop = useMediaQuery('(min-width: 1024px)');
		const isMobile = useMediaQuery('(max-width: 600px)');

		// Background url вычисляется — когда изменяется isDesktop, isMobile
		// И сама функция отдает строку — это один url под текущий размер окна
		const backgroundUrl = computed(() => {
			if (isDesktop.value) {
				return desktop;
			}

			if (isMobile.value) {
				return mobile || tablet || desktop;
			}

			return tablet || desktop;
		});

		watchEffect(() => {
			if (backgroundUrl.value) {
				el.style.backgroundImage = `url("${backgroundUrl.value}")`;
			}
		});
	},
};
