<script setup>
import LPicture from '@/components/base/l-picture.vue';
import Gallery from '@/components/game/game-carousel/gallery.vue'
import LearnMore from '@/components/base/base-learn-more.vue';
import BaseModal from '@/components/base/base-modal.vue';
import currencyList from '@/utils/currency';
import seo from '@/utils/seo';
import GiftingModal from '@/components/gifting-modal.vue';
import GameInfo from '@/components/game/game-info.vue';
import GameSocials from '@/components/game/game-socials.vue';
import GameSystem from '@/components/game/game-system.vue';
import GameLinkedCard from '@/components/game/linked-card.vue';
import useMobileTablet from '@/composables/mobile-tablet-desktop';
import { useShowLogin } from '~/composables/login';
import { authTokenCookieKey } from '~/utils/ltg';
import LButton from '~/components/base/v2/l-button.vue';
import useLauncherDownload from '~/composables/launcher-download';
import SubscriptionPackageList from '~/components/game/subscription/subscription-package-list.vue';
import { getLinkedGames } from '~/pages/game/utils';
import ShareToGetRewardModal from '~/components/game/share-to-get-reward-modal.vue';
import NewsletterConsentBlock from '~/components/game/newsletter-consent/newsletter-consent-block.vue';
import { useNuxtApp, useState, useCookie, useRouter, useAsyncData, useHead } from 'nuxt/app';
import { useRoute } from 'vue-router';
import { ref, computed, onUpdated, onMounted, watch } from 'vue';
import { checkAndFixGameData } from '~/utils/game';
import usePromocodeSelection from '~/composables/promocode-selection';
import useGamePrice from '~/composables/game/game-price';
import usePaystation from '~/composables/game/paystation';
import PurchaseBlock from '~/components/game/purchase-block';
import ItemPaymentList from '~/components/game/item-payment-list.vue';
import { logPostMessage } from '@/utils/postmessage-logger';

const { $api, $i18n, $events, $xsollaAnalytics } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const localeCookie = useCookie(localeCookieKey);

useHead({
	title: seo[route.params.slug]?.title || seo.default.title,
	meta: seo[route.params.slug]?.meta || seo.default.meta,
});

const currency = useState('currency');

const { data: game } = await useAsyncData(
	async () => {
		const rawGame = await $api.getGame(route.params.slug, `currency=${currency.value}`);
		return checkAndFixGameData(rawGame);
	},
	{ watch: [localeCookie] }
);

const { handleLauncherDownload } = useLauncherDownload();
const { promocodes, onPromocodeSelected, selectedPromocode } = usePromocodeSelection({
	gamePath: game.value.path,
});

const {
	currentPlanTokenData,
	currentPriceData,
	isLoadingPriceData,
	isLoadingPlansTokenData,
	plans,
	currentPlan,
	activeSubscription,
	plansTokenData,
} = useGamePrice({
	game: game.value,
	currency: currency.value,
	promocode: selectedPromocode,
});

const { openPaystation } = usePaystation();

const { mobile, tablet, desktop } = useMobileTablet();

const tokenData = ref({ token: null, error: $i18n.t('common.somethingWentWrong') });
const giftTokenData = ref({ token: null, error: $i18n.t('common.somethingWentWrong') });

const shouldPaystationBeOpenedAfterTokenLoaded = ref(false);
const articles = ref([]);

const showSubscriptionError = ref(false);

const shareToGetRewardModal = ref(false);
const showGiftModal = ref(false);
const giftLoading = ref(false);
const giftData = ref([]);
const activeGiftData = ref([]);
const currencySymbol = ref('');

const linkedGames = ref([]);

const user = useState('user');

const showRecomended = computed(() => {
	if (!game.value?.system?.recommended) {
		return false;
	}

	const recommendedVals = Object.entries(game.value.system.recommended || {});

	let recommended = false;

	recommendedVals.forEach(([k, v]) => {
		if (k !== 'name' && v) {
			recommended = true;
		}
	});

	return recommended;
});

const subCatalog = computed(() => {
	if (game.value?.settings?.project_id == '268183') {
		return '270129';
	} else if (game.value?.settings?.project_id == '268184') {
		return '270136';
	} else {
		return '';
	}
});

const showMinimal = computed(() => {
	if (!game.value?.system?.minimal) {
		return false;
	}

	const minimalVals = Object.entries(game.value.system.minimal || {});

	let minimal = false;

	minimalVals.forEach(([k, v]) => {
		if (k !== 'name' && v) {
			minimal = true;
		}
	});

	return minimal;
});

const isPurchaseBlockVisible = computed(() => {
	const gameType = game.value.settings.type;

	if (gameType !== 'game_key' && gameType !== 'subscription') {
		return false;
	}

	if (game.value.path.replace('/', '') === 'life-is-feudal') {
		return currentPlanTokenData.value?.hasGame !== true;
	}

	if (user.value?.data) {
		return Boolean(
			currentPlanTokenData.value?.token && currentPlanTokenData.value.hasGame !== true
		);
	} else {
		return !isLoadingPriceData.value;
	}
});

function getCurrencySymbol(curr) {
	return currencyList[curr] || curr;
}

function showSubGiftPSModal() {
	// Если пользователь не авторизован
	// Открываем окно login
	if (!user.value) {
		useShowLogin();
		return;
	}

	// Если нет токена
	// Открываем модаальное окно с ошибкой
	if (!giftTokenData.value?.token) {
		showSubscriptionError.value = true;
		return;
	}

	const { token, sandbox_mode: isSandbox } = giftTokenData.value;

	openPaystation({
		token,
		isSandbox,
	});
}

function showBuyModal(planId) {
	if (!user.value?.data) {
		useShowLogin();
		return;
	}

	const planIdIsEqualOrNotSet = planId === currentPlan.value.planId || !planId;

	const tokenData = planIdIsEqualOrNotSet
		? currentPlanTokenData.value
		: plansTokenData.value[planId];

	if (!tokenData?.token) {
		console.error('no tokenData');
		showSubscriptionError.value = true;
		return;
	}

	const { token, sandbox_mode: isSandbox } = tokenData;

	openPaystation({
		token,
		isSandbox,
	});
}

async function getSubscriptionGifts() {
	const projectId = game.value?.settings?.project_id;
	const res = await $api.getSubscriptionGifts(projectId);
	try {
		// For promise all (increase speed)
		async function getStoreXsollaItem(projectId, sku) {
			try {
				const data = await fetch(
					`https://store.xsolla.com/api/v2/project/${projectId}/items/virtual_items/sku/${sku}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				return data.json();
			} catch (e) {
				console.error(e);
			}
		}

		const data = res?.data?.map((el) => getStoreXsollaItem(el?.projectId, el?.sku));
		if (!data) {
			return [];
		}
		return Promise.all(data)
			.then((val, result = []) => {
				for (let i = 0; i < res.data.length; i++) {
					const SKUData = val.find((el) => el?.sku === res?.data[i]?.sku);
					if (SKUData === undefined) {
						continue;
					}
					result.push({ ...res.data[i], ...SKUData });
					result[i].title = result[i]?.name.split(' -')[0];
					result[i].period = result[i]?.name.split('- ')[1];
				}
				return result.sort((a, b) => b.default - a.default);
			})
			.catch((e) => console.error(e));
	} catch (e) {
		console.error(e);
	}
}

async function openSubGiftPS(receiver) {
	const sku = activeGiftData.value?.sku;
	const couponId = activeGiftData.value?.couponId;
	giftTokenData.value = await getToken({
		receiver,
		currency: currency.value,
		sku,
		couponId,
		isSubGift: true,
	});
	return showSubGiftPSModal();
}

function showIframeModal() {
	if (!user.value) {
		return useShowLogin();
	}
	$events.emit('modal:opened', true);
	let link = game.value?.links?.play_iframe;
	if (link) {
		link += '?token=' + useCookie(authTokenCookieKey).value;
		const overlayDivWrap = document.getElementById('game-overlay-wrapper');
		const overlayDiv = document.getElementById('game-overlay');
		const gameIframe = document.createElement('iframe');
		gameIframe.src = link;
		overlayDivWrap.appendChild(gameIframe);
		document.body.appendChild(overlayDiv);
		overlayDiv.classList.add('active');
	}
}

function hideIframeModal() {
	const overlayDivWrap = document.getElementById('game-overlay-wrapper');
	const overlayDiv = document.getElementById('game-overlay');
	overlayDiv.classList.remove('active');
	overlayDivWrap.innerHTML = '';
	$events.emit('modal:closed', true);
}

async function getToken(game) {
	if (game?.isSubGift) {
		return await $api.getSubGiftToken({
			coupon: game.couponId,
			currency: game.currency || 'USD',
			sku: game.sku,
			receiver: game.receiver,
		});
	}

	return await $api.getToken({
		slug: game.gameName,
		currency: game.currency,
		type: game.type,
		planId: game.planId,
	});
}

async function closeGiftModal() {
	if (route.query?.section === 'gift') {
		await router.push({ path: route.path });
	}
	showGiftModal.value = false;
	$events.emit('modal:closed', true);
}

function scrollFullInfo() {
	window.scrollTo({
		top: (document.getElementById('scrollInfo').offsetTop / 100) * 95,
		behavior: 'smooth',
	});
}

function updateActiveGift(gift) {
	activeGiftData.value = gift;
}

async function giftFriend() {
	if (!user.value) {
		useShowLogin();
		return;
	}

	showGiftModal.value = true;
	if (giftData.value.length !== 0) {
		giftLoading.value = false;
		return;
	}

	giftLoading.value = true;
	giftData.value = await getSubscriptionGifts();
	currencySymbol.value = getCurrencySymbol(giftData.value?.[0]?.price?.currency) || 'USD';
	activeGiftData.value = giftData.value.find((el) => el.default === true);
	giftLoading.value = false;
}

function setAddEventListener() {
	window.addEventListener('message', receiveMessage, false);

	function receiveMessage(event) {
		logPostMessage(event, 'Xsolla Paystation');
		let data;
		if (
			event.origin !== 'https://sandbox-secure.xsolla.com' &&
			event.origin !== 'https://secure.xsolla.com'
		) {
			return false;
		}
		// @ts-expect-error
		// eslint-disable-next-line
		if (typeof event?.data == 'Object') {
			data = event.data;
		} else if (typeof event?.data == 'string') {
			data = JSON.parse(decodeURI(event.data));
		}
		if (data?.command === 'open-paystation') {
			$events.emit('paystation:opened', true);
			// @ts-expect-error

			if (typeof gtag !== 'undefined') {
				// @ts-expect-error
				// eslint-disable-next-line
				gtag('event', `open_paystation_${route.params.slug}`);
			}
		} else if (data?.command === 'close') {
			$events.emit('paystation:closed', true);
		}
		if (data?.command === 'change-status') {
			if (data?.data?.action === 'change-status' && data?.data?.value === 'done') {
				$events.emit('paystation:purchased', true);
				// @ts-expect-error

				if (typeof gtag !== 'undefined') {
					// @ts-expect-error
					// eslint-disable-next-line
					gtag('event', `purchase_${route.params.slug}`, {
						value: data?.data?.purchase_sum,
						currency: data?.data?.purchase_currency,
						transaction_id: data?.data?.purchase_invoice_id,
					});
				}
				// @ts-expect-error

				if (typeof gtag !== 'undefined') {
					// @ts-expect-error
					// eslint-disable-next-line
					gtag('event', `purchase`, {
						game: route.params.slug,
						value: data?.data?.purchase_sum,
						currency: data?.data?.purchase_currency,
						transaction_id: data?.data?.purchase_invoice_id,
					});
				}
			}
		}
	}
}

function toggleShareModal() {
	shareToGetRewardModal.value = !shareToGetRewardModal.value;
}

function closeShareModal() {
	if (user?.value?.data?.shareToGetRewards?.[game.value._id]) {
		window.location.href = `/game${game.value.path}`;
	}
	shareToGetRewardModal.value = !shareToGetRewardModal.value;
}

function updateUserData() {
	if (!user.value) {
		return;
	}

	user.value = {
		...user.value,
		data: {
			...user.value.data,
			shareToGetRewards: {
				...user.value.data.shareToGetRewards,
				[game.value._id]: true,
			},
		},
	};
}

onUpdated(async () => {
	const action = route.query.action;

	if (action === 'download-launcher') {
		await router.replace({
			query: {
				...router.query,
				'download-launcher': undefined,
			},
		});

		await handleLauncherDownload(game.value.path.replace('/', ''));
	}

	if (action === 'open-paystation') {
		shouldPaystationBeOpenedAfterTokenLoaded.value = true;
		await router.replace({
			query: {
				...router.query,
				'open-paystation': undefined,
			},
		});
	}
});

watch([shouldPaystationBeOpenedAfterTokenLoaded, currentPlanTokenData], () => {
	if (!shouldPaystationBeOpenedAfterTokenLoaded.value || !currentPlanTokenData.value?.token) {
		return;
	}

	shouldPaystationBeOpenedAfterTokenLoaded.value = false;

	showBuyModal();
});

onMounted(async () => {
	if (route.query?.section === 'gift') {
		await giftFriend();
	}

	setAddEventListener();
	setTimeout(async () => {
		articles.value = await $api.getGameArticles(game.value?._id);
	}, 100);
});

if ($xsollaAnalytics !== undefined) {
	$xsollaAnalytics.hit(route.fullPath, {
		en: 'xpp_game_screen_visit',
		ev: game.value?._id,
	});
}

// in current flow, user changes only when we're logging in metaframe
watch(
	user,
	() => {
		getLinkedGames(route.params.slug, currency.value).then((games) => {
			linkedGames.value = games;
		});
	},
	{ immediate: true }
);

useHead({
	title: `${game.value.name} | Long Tale Games`,
	meta: [{ name: 'description', content: game?.value?.metaTags?.description }],
});
</script>

<template>
	<div v-if="game && game.info">
		<section v-background-image="game.images.bg" class="game-hero">
			<div class="container">
				<div class="game-hero__wrapper">
					<div class="game-hero__block-left">
						<h1 class="game-hero__title">{{ game.name }}</h1>
						<p class="game-hero__description">{{ game.description }}</p>
						<Learn-more @click="scrollFullInfo">{{ $t('game.learnMore') }}</Learn-more>
					</div>
					<div class="game-hero__block-right">
						<div class="game-hero__picture">
							<figure v-background-image="game.images.main">
								<img :src="game.images.main" style="width: 100%; height: 100%" />
							</figure>
						</div>
						<GameSocials
							class="game-header__social"
							:socials="game.socials"
							:game-id="game._id" />
					</div>
					<div class="game-hero__info">
						<!-- Кнопки «Play now», «Website» -->
						<div
							v-if="
								game.links?.play_iframe ||
								game.links?.website ||
								game.links?.play_link ||
								game.links?.play_link_external ||
								game.links?.download ||
								game?.settings?.shareToGetRewardData?.enabled
							"
							class="game-hero__buttons">
							<LButton
								v-if="
									game?.settings?.sub_gift_active &&
									game?.settings?.type === 'subscription'
								"
								@click="giftFriend"
								v-click-metrika="{ name: 'xpp_game_gift_click', ev: game?._id }"
								:data-pixel="`gift-${game.settings.type}-${$route.params.slug}`">
								{{ $t('game.gift') }}
							</LButton>
							<LButton
								v-if="game?.links?.play_iframe"
								v-click-metrika="{ name: 'xpp_game_play_click', ev: game?._id }"
								variant="accent-gradient"
								@click="showIframeModal">
								{{ $t('game.play') }}
							</LButton>
							<LButton
								v-if="game?.links?.play_link"
								:disabled="!desktop"
								variant="accent-gradient"
								:href="game?.links?.play_link">
								{{ $t('game.play') }}
							</LButton>
							<LButton
								v-if="game?.links?.play_link_external"
								variant="accent-gradient"
								:href="game?.links?.play_link_external"
								target="_blank">
								{{ $t('game.play') }}
							</LButton>

							<LButton
								v-if="game.links.website"
								v-click-metrika="{ name: 'xpp_game_website_click', ev: game?._id }"
								:href="game.links.website"
								target="_blank">
								{{ $t('game.website') }}
							</LButton>
							<LButton
								v-if="
									game?.settings?.shareToGetRewardData?.enabled &&
									user?.data &&
									!user?.data?.shareToGetRewards?.[game?._id || '']
								"
								@click="toggleShareModal"
								:data-pixel="`gift-${game.settings.type}-${$route.params.slug}`">
								{{ $t('game.shareToGetReward') }}
							</LButton>
							<LButton v-if="game.links.dashboard" :href="game.links.dashboard">
								{{ $t('game.dashboard') }}
							</LButton>
							<LButton v-if="game.links.download" :href="game.links.download">
								{{ $t('game.download') }}
							</LButton>
						</div>
						<PurchaseBlock
							v-if="isPurchaseBlockVisible"
							@promocode-selected="onPromocodeSelected"
							:promocodes="promocodes"
							:game="game"
							:paystation-token-data="currentPlanTokenData"
							:selected-promocode="selectedPromocode"
							:price-display-data="currentPriceData"
							:is-loading-price-data="isLoadingPriceData" />
						<GameInfo :info="game.info" />
					</div>
				</div>
			</div>
		</section>

		<SubscriptionPackageList
			@change-plan="showBuyModal"
			v-if="plans && plans.length > 1"
			:plans="plans"
			:is-data-loading="isLoadingPlansTokenData"
			:active-subscription="activeSubscription" />
		<ItemPaymentList v-if="subCatalog" :game="game" />
		<div class="w-ab-100">
			<div v-if="game.modification && linkedGames.length" class="games-modifications">
				<div class="container">
					<h2 class="games-modifications__title title">{{ $t('game.modifications') }}</h2>
					<p class="games-modifications__text">
						{{ game.modification }}
					</p>

					<div class="games__list">
						<GameLinkedCard
							v-for="linkedGame in linkedGames"
							:key="linkedGame._id"
							:description="linkedGame.description"
							:name="linkedGame.name"
							:path="linkedGame.path"
							:images="linkedGame.images"
							:price="linkedGame.price"
							:property="linkedGame.property" />
					</div>
				</div>
			</div>
		</div>

		<Gallery
			v-if="game.gallery?.showScreenshots || game.gallery?.showVideos"
			:gallery="game.gallery"
		/>

		<LPicture
			class="p-a"
			src="https://cdn.ltg.com/arts/game-description-bg.png"
			alt="background-image"
			object-fit="contain" />

		<div id="scrollInfo" class="w-ab-100 mb-3-M mb-10-S mb-34 fd-c ai-c container">
			<h2 class="game-body-title">
				{{ game.body.title }}
			</h2>

			<div class="htmlLIF" v-html="game.body.description"></div>
		</div>

		<div
			v-if="articles?.length"
			class="mb-px-80-L mb-10-M mb-20-S mb-23 container news-container"
			:class="{ 'w-ab-100': mobile }">
			<!-- News -->
			<div class="w-ab-100 fd-c ai-c jc-c">
				<div class="w-ab-100 fd-r ai-c jc-b">
					<div class="fs-px-23-L fs-24-M fs-28-S fs-20 fw-7">{{ $t('game.news') }}</div>
					<LButton size="small" variant="accent" href="/news">
						{{ $t('game.showMore') }}
					</LButton>
				</div>
				<div
					:class="mobile ? 'scroll fd-r gp' : 'gap'"
					class="w-ab-100 mt-px-3-L mt-px-3-M mt-px-3-S mt-px-0 news-list">
					<NewsCard
						v-for="article of articles"
						xm-name="xpp_game_news_click"
						:key="article._id"
						:is-horizontal-scroll="mobile"
						:size="tablet ? 3 : 4"
						class="w-ab-100"
						:article="article" />
				</div>
			</div>
		</div>

		<section v-if="game?.system && (showMinimal || showRecomended)" class="system-guide">
			<div class="container">
				<div class="system-guide__title section__title">{{ $t('game.system.title') }}</div>
				<div class="system-guide__cards">
					<GameSystem
						v-if="showMinimal"
						:item="{ ...game.system.minimal, name: `${$t('game.system.minimal')}` }" />
					<GameSystem
						v-if="showRecomended"
						:item="{
							...game.system.recommended,
							name: `${$t('game.system.recommended')}`,
						}" />
				</div>
			</div>
		</section>

		<NewsletterConsentBlock />

		<BaseModal v-if="showSubscriptionError" @close="showSubscriptionError = false">
			<p style="text-align: center; font-size: 1.5rem">{{ tokenData?.error }}</p>
		</BaseModal>
		<div id="game-overlay">
			<a href="#" class="game-overlay__close" @click="hideIframeModal">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12 13.4L7.10005 18.3C6.91672 18.4833 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4833 5.70005 18.3C5.51672 18.1167 5.42505 17.8833 5.42505 17.6C5.42505 17.3167 5.51672 17.0833 5.70005 16.9L10.6 12L5.70005 7.1C5.51672 6.91667 5.42505 6.68334 5.42505 6.4C5.42505 6.11667 5.51672 5.88334 5.70005 5.7C5.88338 5.51667 6.11672 5.425 6.40005 5.425C6.68338 5.425 6.91672 5.51667 7.10005 5.7L12 10.6L16.9 5.7C17.0834 5.51667 17.3167 5.425 17.6 5.425C17.8834 5.425 18.1167 5.51667 18.3 5.7C18.4834 5.88334 18.575 6.11667 18.575 6.4C18.575 6.68334 18.4834 6.91667 18.3 7.1L13.4 12L18.3 16.9C18.4834 17.0833 18.575 17.3167 18.575 17.6C18.575 17.8833 18.4834 18.1167 18.3 18.3C18.1167 18.4833 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4833 16.9 18.3L12 13.4Z"
						fill="white" />
				</svg>
			</a>
			<div id="game-overlay-wrapper"></div>
		</div>
		<GiftingModal
			v-show="showGiftModal"
			:currency-symbol="currencySymbol"
			:active-gift-data="activeGiftData"
			:gift-data="giftData"
			:loading="giftLoading"
			@update-active-gift="updateActiveGift"
			@close-sub="closeGiftModal"
			@open-sub-gift-p-s="openSubGiftPS" />

		<ShareToGetRewardModal
			v-if="shareToGetRewardModal"
			:data="game?.settings?.shareToGetRewardData"
			:game="game"
			@close="closeShareModal"
			@success="updateUserData" />
	</div>
</template>

<style lang="scss">
@import 'assets/css/variables';

.game-body-title {
	font-size: 50px;
	line-height: 56px;
	text-align: center;
	font-weight: 700;
	font-family: var(--pilat-wide-font-family);
	text-transform: uppercase;
	max-width: 750px;

	margin-bottom: 50px;

	@media (max-width: $max-mobile) {
		font-size: 35px;
	}
}

.news-container {
	margin-top: 100px;
}

.news-list {
	grid-template: 1fr / repeat(4, 1fr);

	@media (max-width: $max-mobile) {
		margin-top: 30px;
		grid-template: 1fr / 1fr;
	}
}

.htmlLIF {
	word-break: break-word;
	font-family: var(--inter-font-family);
	text-align: center;
	max-width: 940px;

	& > h1,
	& > h2,
	& > h3,
	& > h4,
	& > h5,
	& > h6 {
		&,
		&:empty {
			margin: 0;
		}

		font-weight: 700;

		&:not(:has(p)) {
			margin: 50px 0 10px;
		}
	}

	p {
		/* !important is used here to override inline style specificity in html received from backend */
		font-size: 16px !important;
		line-height: 24px;
		color: var(--white-80);
		font-weight: 500;

		&,
		&:empty {
			margin: 0;
		}
	}

	& > h1 {
		font-size: 32px;
		font-weight: 700;
	}

	& > h2 {
		font-size: 30px;
	}

	& > h3 {
		font-size: 24px;
		line-height: 32px;
	}

	& > h4 {
		font-size: 22px;
	}

	& > h5 {
		font-size: 20px;
	}

	& > h6 {
		font-size: 18px;
	}

	b {
		font-weight: 700;
	}

	ul {
		list-style-type: disc;
		font-size: 0.869vw;
		@media (max-width: 1100px) {
			font-size: 1.501vw;
		}
		@media (max-width: 769px) {
			font-size: 4.424vw;
		}

		li {
			text-align: left;

			p {
				margin: 0;
			}
		}
	}

	a {
		color: #bfbfff;
		text-decoration: underline;
		font-size: 16px;
		@media (max-width: 769px) {
			font-size: 18px;
		}
	}
}

.bg {
	background: var(--card-gradient-y);
}

.text {
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

@media (min-width: 1921px) {
	.htmlLIF {
		h1 {
			font-size: 22px;
		}

		p {
			font-size: 16px;
		}
	}
}

.container p {
	word-break: break-word;
}

.game-hero__buttons {
	gap: 10px;
	flex-wrap: wrap;

	@media (max-width: $max-mobile) {
		flex-direction: column;
		& > button,
		& > a {
			width: 100%;
		}
	}
}

.game-hero__block-left {
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	.game-hero__buttons {
		margin-top: 40px;
		@media screen and (max-width: 1200px) {
			margin-top: auto;
		}
		@media screen and (max-width: 480px) {
			display: block;
			.button {
				width: 100%;
				margin-bottom: 20px;
			}
		}
	}
}

.game-hero__price {
	background: transparent;
	font-family: var(--pilat-wide-font-family);

	border-top: none;
	padding: var(--space-125) 0 var(--space-475);
}

.price-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;

	@media screen and (max-width: 480px) {
		flex-wrap: wrap;
		align-items: center;
		flex-direction: column-reverse;
		gap: 10px;
		background: #1a1736;
		border-radius: 16px;
		padding: 20px;
	}

	.button {
		& + button {
			margin-left: 10px;

			@media screen and (max-width: 480px) {
				margin: 10px 0 0 0;
			}
		}

		@media screen and (max-width: 480px) {
			order: 2;
			width: 100%;
		}
	}
}

.price-wrapper__border {
	padding-bottom: 16px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.11);
	margin-bottom: 16px;

	@media screen and (max-width: 480px) {
		padding-bottom: 20px;
		border-bottom: 0;
		margin-bottom: 20px;
	}
}

.price-item {
	gap: 10px;
	display: flex;
	flex-direction: column;
	margin-left: auto;
	font-size: 26px;
	text-align: right;
	text-transform: uppercase;
	font-weight: 700;
	@media screen and (max-width: 480px) {
		text-align: center;
		order: 1;
		display: block;
		flex-direction: column;
		align-items: flex-end;
		width: 100%;
		margin-bottom: 20px;
	}
}

.price-item-sale {
	font-weight: 600;
	font-size: 18px;
	line-height: 22px;
	text-align: right;
	text-decoration-line: line-through;
	text-transform: uppercase;
	color: #8f94a5;
}

.price-item-sale-label {
	font-weight: 700;
	font-size: 18px;
	line-height: 22px;
	align-items: center;
	text-align: center;
	text-transform: uppercase;
	color: #ffffff;
	padding: 2px 5px;
	background: #e80000;
}

.price-item-cell__price {
	margin-right: 4px;
}

.price-item-row {
	gap: 15px;
	display: flex;
	justify-content: space-between;
	color: #fff;
	font-size: 22px;
	font-weight: 500;
	text-transform: uppercase;
	@media screen and (max-width: 480px) {
		display: block;
		text-align: left;
		margin-bottom: 15px;
	}
}

.price-item-row__sub {
	font-size: 16px;
	font-style: normal;
	font-weight: 600;
	text-transform: uppercase;

	& > .price-item-cell {
		color: var(--card-text-color-minor);
		font-weight: 700;
		line-height: 20px;
	}
}

.price-item-cell {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-weight: 700;
	gap: 5px;
	color: var(--white);

	&:first-of-type {
		min-width: 200px;
	}

	@media screen and (max-width: 480px) {
		align-items: flex-start;
		justify-content: center;
		margin-bottom: 10px;
	}
}

.price-item-cell__price {
	justify-content: flex-start;
	gap: 10px;
	flex: 1;

	@media screen and (max-width: 480px) {
		text-align: left;
		align-items: flex-start;
		justify-content: center;
	}
}

.price-action {
	max-width: 286px;
	padding: 0 10px 0 20px;
	font-size: 20px;
	line-height: 24px;
	text-transform: uppercase;
}

#game-overlay {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 10000;
	background: #000;
	display: none;
}

#game-overlay.active {
	display: block;
}

#game-overlay .game-overlay__close {
	position: absolute;
	top: 40px;
	right: 40px;
	width: 40px;
	height: 40px;
	z-index: 15;
}

#game-overlay-wrapper {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 10;
	background: #000;
}

#game-overlay iframe {
	width: 100%;
	height: 100%;
}

.game--learn-more .button {
	padding-left: 0;
}

.payment-description {
	margin-right: auto;
	font-weight: 400;
	font-size: 20px;
	line-height: 24px;
	text-transform: uppercase;
	color: #ffffff;
	max-width: 40%;
}

.mobile__price-block {
	width: 100%;
	background: #1a1736;
	border-radius: 16px;
	padding: 30px 20px;
}

.mobile__price-block .price-wrapper {
	justify-content: space-between;
	align-items: normal;
	flex-direction: column;
}

.mobile__price-block .payment-description {
	max-width: 100%;
}

.mobile__price-block .price-item {
	margin-top: 20px;
	margin-bottom: 20px;
}

.mobile__price-block .price-item-cell {
	justify-content: end;
}

.mobile-social {
	flex-direction: row;
	justify-content: center;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	margin-top: 20px;
}

.mobile-social li {
	padding: 0 20px;
}

.mobile-social li a img {
	width: 36px;
}

.nsize-button {
	padding-top: 26px;
	padding-bottom: 26px;
}

.system-guide {
	padding: 50px 0;
}

.system-guide__cards {
	display: flex;
	align-items: stretch;
	justify-content: space-between;
	gap: 20px;

	@media screen and (max-width: 768px) {
		flex-direction: column;
	}
}

.system-guide__title {
	margin-bottom: 50px;
	font-size: 24px;
	font-weight: 700;
}

</style>
