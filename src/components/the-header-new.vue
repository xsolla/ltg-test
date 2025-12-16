<script lang="ts" setup>
import { logo, menu } from '~/utils/ltg';
import Link from '~/components/base/link.vue';
import LangDropdown from '@/components/lang-dropdown.vue';
import LButton from '~/components/base/v2/l-button.vue';
import ProfileDropdown from '~/components/menu/profile-dropdown.vue';
import BurgerMenuButton from '~/components/header/burger-menu-button.vue';
import DesktopMenuList from '~/components/header/desktop-menu-list.vue';
import useMobileTablet from '~/composables/mobile-tablet-desktop';
import useLauncherDownload from '~/composables/launcher-download';
import { useUseragent } from '~/composables/useragent';
import { useMetaframe } from '~/composables/metaframe';
import type { Game } from '~/types/game';
import { useAsyncData } from '#app';
import platformUtils from '~/utils/platform';
import { computed } from 'vue';
import MobileMenu from '~/components/header/mobile-menu.vue';
import { checkAndFixGameData } from '~/utils/game';
import BurgerIcon from '~/components/icon/ui-kit/burger.vue';

const route = useRoute();
const isMenuPositionFixed = ref(false);
const { mobile, tablet, desktop } = useMobileTablet();
const showMobileMenu = ref(false);
const { handleDownloadPageNavigation } = useLauncherDownload();
const { useragent } = useUseragent();
const { $api, $i18n } = useNuxtApp();
const { data: games } = useAsyncData(() => $api.getGamesMenu(), { server: true });
const showXsollaModalAuth = useState('showXsollaModalAuth', () => false);
const launcherLink = useState('launcherLink');
const hideLoginButton = ref(true);
const metaframe = useMetaframe();

const hasCBTAccess = useState<boolean>('has-cbt-access');
const user = useState('user');

const isLoginOpen = ref(false);
const isLoadingEmail = ref(true);

const elements = computed(() => {
	const elements = Object.assign([], menu);
	if (games.value?.length) {
		// @ts-expect-error

		elements[1].dropdown = games.value;
	}
	return elements;
});

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

const game = ref<Game | null>(null);

const getGame = async () => {
	game.value = await $api.getGame('life-is-feudal-arden', '') as Game
}

watch(desktop, (val) => {
	if (val) {
		showMobileMenu.value = false;
	}
});

watch(
	() => route.path,
	() => (showMobileMenu.value = false),
	{ deep: false }
);

watch(user, () => {
	checkCBTAccess();
});

// const isDownloadButtonDisabled = platformUtils.isMac(useragent);
const isDownloadButtonDisabled = computed(() => {
	return platformUtils.isMac(useragent) || route.path.includes('dominations');
});
const downloadButtonText = computed(() =>
	platformUtils.isMac(useragent) ? $i18n.t('menu.launcherIsPcOnly') : $i18n.t('menu.download')
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

const onWindowScroll = () => {
	if (window.scrollY > 500 && !isMenuPositionFixed.value) {
		isMenuPositionFixed.value = true;
	} else if (window.scrollY <= 500 && isMenuPositionFixed.value) {
		isMenuPositionFixed.value = false;
	}
};

const isScrolledHeaderVisible = ref(false);

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

	<header class="header header--new" :class="['header', { 'header--scrolled': isScrolledHeaderVisible, 'header--fixed': isMenuPositionFixed }]">
		<div class="header__container">

			<div class="header__left">
				<!-- LOGO -->
				<Link to="/" class="header-logo header__logo">
					<img
						:class="isMenuPositionFixed ? 'main-logo-scroll': 'main-logo'"
						:src="logo"
						alt="LTG Logo" />
				</Link>

				<!-- MENU -->
				<DesktopMenuList
					v-if="elements && elements.length"
					:elements="elements"
					class="header__menu"
				/>
			</div>

			<div class="header__right">
				<!-- Right Bar-->
				<div class="user-bar">

					<ProfileDropdown v-if="user" class="header__profile-dropdown"/>
					<LangDropdown v-if="desktop" />

				</div>

				<!-- CBT Button -->
				<div v-if="desktop">
					<a v-if="hasCBTAccess"
					   :data-pixel="`clicktocbtpage`"
					   href="/game/life-is-feudal-arden/thank-you"
					   class="btn-cbt-page"
					>
						<span>{{ `Arden Info` }}</span>
					</a>
				</div>

				<!--XPP Button -->
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
				<BurgerMenuButton v-if="!desktop" @click="showMobileMenu = true" class="button-burger"/>
			</div>

			<!--  Mobile MENU -->
			<MobileMenu
				@close-click="showMobileMenu = false"
				v-if="showMobileMenu && (mobile || tablet)"
				:elements="elements" />
		</div>
	</header>
</template>
<style lang="scss" scoped>
.bg {
	background: var(--reskin-primary-dark-color);
	transition: all 200ms ease-in-out;
}

.header {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: auto;
	z-index: 300;
	background-color: transparent;
	transition: background-color 0.3s ease;

	&.header--scrolled {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 900;
		background-color: var(--reskin-primary-dark-color); // Темный фон
	}

	&.header--fixed {
		position: fixed;
		top: 0;
		z-index: 900;
		background-color: var(--reskin-primary-dark-color);
	}

	@media (min-width: 1800px) {
		z-index: 2;
	}

	@media (max-width: 768px) {
		&.with-any-metaframe-page-visible {
			z-index: 2;
		}
	}

	button:not(.button-burger) {
		@media (max-width: 1200px) {
			padding-left: 20px;
			padding-right: 20px;
		}
	}
}

.header__container {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 1vw 20px;
	width: 100%;
	max-width: 1340px;
	margin: 0 auto;
	transition: padding-right linear 0.3s;

	@media screen and (max-width: 1024px) {
		height: 65px;
		padding: 10px 20px;
	}

	@media screen and (max-width: 768px) {
		height: 51px;
		padding: 10px 20px;
	}
}

.header__left,
.header__right {
	display: flex;
	align-items: center;
}

.header__right {
	margin-left: auto;
}

.header__logo {
	margin-right: 52px;

	img {
		width: 71px;
		height: 56px;

		@media screen and (max-width: 1024px) {
			width: 54px;
			height: 44px;
		}

		@media screen and (max-width: 768px) {
			width: 54px;
			height: 34px;
		}

		@media screen and (max-width: 480px) {
			width: 39px;
			height: 30px;
		}
	}
}

.header__menu {
	min-width: 300px;
	margin-right: auto;
}

.user-bar {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 0 10px;
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
	background: #B0BAEE;

	span {
		position: relative;
		z-index: 3;
		color: #0d143a;
		font-family: "Pilat Wide", "Montserrat", sans-serif;
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

.profile_dropdown li {
	&:hover {
		background: #120f2c;
	}
}

.header__profile-dropdown {
	@media screen and (max-width: 1100px) {
		display: none;

	}
}
</style>
