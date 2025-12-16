<script lang="ts" setup>
import MenuElement from '~/components/menu-element.vue';
import LangDropdown from '@/components/lang-dropdown.vue';
import Link from '@/components/base/link.vue';
import { menu, logo } from '@/utils/ltg';
import { useWindowScroll } from '@vueuse/core';
import useMobileTablet from '@/composables/mobile-tablet-desktop';
import { useMetaframe } from '~/composables/metaframe';
import LButton from '~/components/base/v2/l-button.vue';
import platformUtils, { isMac } from '~/utils/platform';
import useLauncherDownload from '~/composables/launcher-download';
import ProfileDropdown from '~/components/menu/profile-dropdown.vue';
import { computed } from 'vue';
import { useUseragent } from '~/composables/useragent';
import { useAsyncData } from '#app';
import BurgerMenuButton from '~/components/header/burger-menu-button.vue';
import DesktopMenuList from '~/components/header/desktop-menu-list.vue';
import MobileMenu from '~/components/header/mobile-menu.vue';
import { checkAndFixGameData } from '~/utils/game';
import type { Game } from "~/types/game";
import BurgerIcon from '~/components/icon/ui-kit/burger.vue';

const hasCBTAccess = useState<boolean>('has-cbt-access');
const game = ref<Game | null>(null);
// получить цены по товарам
const checkCBTAccess = async () => {
	// Кнопка CBT доступна только для авторизованных пользователей.
	if (!user.value) {
		hasCBTAccess.value = false;
		return;
	}
	hasCBTAccess.value = true;
	return;
};

const getGame = async () => {
	game.value = (await $api.getGame('life-is-feudal-arden', '')) as Game;
};

const { mobile, tablet, desktop } = useMobileTablet();

const isMenuPositionFixed = ref(false);

const { $api, $i18n } = useNuxtApp();

const { data: games } = useAsyncData(() => $api.getGamesMenu(), { server: true });

const showMobileMenu = ref(false);

const elements = computed(() => {
	const elements = Object.assign([], menu);
	if (games.value?.length) {
		// @ts-expect-error

		elements[1].dropdown = games.value;
	}
	return elements;
});

watch(desktop, (val) => {
	if (val) {
		showMobileMenu.value = false;
	}
});

const route = useRoute();

const { handleDownloadPageNavigation } = useLauncherDownload();
const { useragent } = useUseragent();

watch(
	() => route.path,
	() => (showMobileMenu.value = false),
	{ deep: false }
);

const isDownloadButtonDisabled = platformUtils.isMac(useragent);

const downloadButtonText = computed(() =>
	isDownloadButtonDisabled ? $i18n.t('menu.launcherIsPcOnly') : $i18n.t('menu.download')
);

const downloadButtonDataPixel = computed(() => {
	if (!isDownloadButtonDisabled) {
		return 'download-launcher-button';
	}

	return null;
});

const onDownloadButtonClick = () => {
	handleDownloadPageNavigation(route.params.slug as string);
};

const user = useState('user');

watch(user, () => {
	checkCBTAccess();
});
const showXsollaModalAuth = useState('showXsollaModalAuth', () => false);

const launcherLink = useState('launcherLink');

const hideLoginButton = ref(true);
const metaframe = useMetaframe();

const onWindowScroll = () => {
	if (window.scrollY > 500 && !isMenuPositionFixed.value) {
		isMenuPositionFixed.value = true;
	} else if (window.scrollY <= 500 && isMenuPositionFixed.value) {
		isMenuPositionFixed.value = false;
	}

	if (!desktop.value && showMobileMenu.value) {
		showMobileMenu.value = false;
	}
};

onMounted(async () => {
	onWindowScroll();
	window.addEventListener('scroll', onWindowScroll);
	setTimeout(() => {
		if (!metaframe.value) {
			hideLoginButton.value = false;
		}
	}, 1000);
	launcherLink.value = await $api.getLauncherLink();
	await getGame();
	await checkCBTAccess();
});
onBeforeUnmount(() => window.removeEventListener('scroll', onWindowScroll));
</script>
<template>
	<header
		ref="header"
		class="p-a t-0 w-ab-100 fd-r jc-c ai-c no-select header"
		:class="{
			['fixed']: isMenuPositionFixed,
		}">
		<div
			class="w-ab-100 h-ab-100 p-a l-0 t-0 bg"
			:class="`${isMenuPositionFixed ? 'o-10' : 'o-0'}`" />
		<div
			class="w-ab-100 fd-r jc-b container header-container"
			:class="`${isMenuPositionFixed ? 'py-3-S py-15' : 'py-4-S py-15'}`"
		>
			<div class="fd-r ai-c menu-container">

				<Link to="/" class="header-logo">
					<img
						:class="
							isMenuPositionFixed
								? 'w-px-10-L main-logo-scroll'
								: 'w-px-10-L main-logo'
						"
						:src="logo"
						alt="LTG Logo" />
				</Link>

				<DesktopMenuList v-if="!tablet && !mobile" :elements="elements" />
			</div>

			<div class="user-bar">
				<LangDropdown v-if="desktop" />
				<ProfileDropdown v-if="user" />
			</div>

			<LButton
				variant="outline"
				data-pixel="login-button"
				@click="showXsollaModalAuth = true"
			>
				{{ $t('menu.login') }}
			</LButton>

			<div v-if="desktop">
				<a v-if="hasCBTAccess"
				   :data-pixel="`clicktocbtpage`"
				   href="/game/life-is-feudal-arden/thank-you"
				   class="btn-cbt-page"
				>
					<span>{{ `Arden Info` }}</span>
				</a>
			</div>

			<LButton
				v-if="desktop"
				v-click-metrika="{
					name: 'xpp_main_download_click',
				}"
				:data-pixel="downloadButtonDataPixel"
				:disabled="isDownloadButtonDisabled"
				variant="accent"
				@click="onDownloadButtonClick">
				{{ downloadButtonText }}
			</LButton>
			<BurgerMenuButton v-if="!desktop" @click="showMobileMenu = true" />
		</div>

		<!--    Мобильное меню -->
		<MobileMenu
			@close-click="showMobileMenu = false"
			v-if="showMobileMenu && (mobile || tablet)"
			:elements="elements" />
	</header>
</template>

<style lang="scss" scoped>

.header {
	z-index: 300;

	&.fixed {
		position: fixed;
		top: 0;
		z-index: 900;
	}

	@media (min-width: 1800px) {
		z-index: 2;
	}
}

.header-container {
	align-items: center;
	display: grid;
	grid-template-columns: 1fr repeat(4, auto);
	justify-content: space-between;
}

.menu-container {
	& > div:first-child,
	& > button:first-child {
		margin-right: 16px;
	}

	& ~ button,
	& ~ div {
		&:not(:last-child) {
			margin-right: 20px;
		}
	}
}

.mobile-menu-item-list {
	display: flex;
	align-items: center;

	& > li:not(:first-child) {
		margin-top: 20%;
	}

	& > li:deep(> div) {
		justify-content: center;

		& > ul {
			right: unset;
			left: unset;
		}
	}
}

.bg {
	background: var(--reskin-primary-dark-color);
	transition: all 200ms ease-in-out;
}

.mobile-menu-icon {
	margin-right: 16px;
	height: 16px;
	width: 20px;
	align-self: center;
}

.header-logo {
	margin-right: 52px;

	img {
		width: 71px;
		height: 56px;

		@media screen and (max-width: 768px) {
			width: 54px;
			height: 44px;
		}
		@media screen and (max-width: 480px) {
			width: 47px;
			height: 39px;
		}
	}
}

.mobile-menu {
	background: var(--reskin-primary-dark-color);

	& > .logo-container {
		padding: 1vw 20px;

		@media (max-width: 768px) {
			padding: 3.75vw 20px;
		}
	}
}

.profile_dropdown li {
	&:hover {
		background: #120f2c;
	}
}

.header .btn-cbt-page {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 156px;
	height: 58px;
	padding: 20px 24px;
	margin-right: 10px;
	border-radius: 0!important;
	opacity: 1;
	cursor: pointer;
	background: #b0baee;
  white-space: nowrap;
	span {
		position: relative;
		z-index: 3;
		color: #0d143a;
		font-family: 'Pilat Wide', 'Montserrat', sans-serif;
		font-size: 16px;
		font-weight: 700;
		font-style: normal;
		text-transform: uppercase;
		white-space: nowrap;
	}

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		opacity: 0;
		background: linear-gradient(#aea0ff, #ffa5eb);
		transition: opacity ease 0.25s;
	}

	&:hover::before {
		opacity: 1;
	}
}

.user-bar {
	display: flex;
	align-items: center;
}

</style>
