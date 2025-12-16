<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';

import { logo, about } from '@/utils/ltg';

import Slider from '@/components/slider/slider.vue';
import LButton from '~/components/base/v2/l-button.vue';
import useLauncherDownload from '~/composables/launcher-download';
const { $api } = useNuxtApp();

const { data: sliders } = await useAsyncData('mainPage_sliders', () => $api.getSliders());

const { data: games } = await useAsyncData('mainPage_games', () => $api.getGamesCatalog());

const { data: news } = await useAsyncData('mainPage_news', () =>
	$api.getHomeArticles('?page=1&pageSize=4')
);
const route = useRoute();
const router = useRouter();

const { mobile, tablet } = useMobileTablet();
const { handleDownloadPageNavigation } = useLauncherDownload();

// Load Games Portal SDK
useHead({
	script: [
		{
			src: 'http://127.0.0.1:8080/client-sdk/portal-sdk.js',
			async: true,
			defer: true
		}
	]
});

onMounted(() => {
	const { action, autoDownloadLauncher } = route.query;
	if (action === 'login') {
		useShowLogin();
	}
	if (autoDownloadLauncher === 'true') {
		handleDownloadPageNavigation();
	} else {
		// Убираем query для action
		router.push({
			query: {
				...route.query,
				action: undefined,
				autoDownloadLauncher: undefined,
			},
		});
	}
});
</script>
<template>
	<div class="w-ab-100 fd-c jc-c ai-c main">
		<Slider :sliders="sliders" />

		<div class="mt-3-L mt-px-6-S mt-20 mb-5-S mb-5-XL mb-20 fd-c ai-c container z-1">
		<div id="banner-container" class="banner-container"></div>
			<div class="w-ab-100 fd-c ai-c">
				<!-- Games Catalog -->
				<div v-if="games?.length" class="games">
					<div class="container px-0">
						<h2 class="section__title">{{ $t('home.games.title') }}</h2>
						<div class="games__list list-reset wrapper">
							<LazyGameCatalogCard
								v-for="(game, index) in games"
								:key="index"
								:card="game" />
						</div>
					</div>
				</div>

				<!-- News -->
				<div class="w-ab-100 fd-c ai-c jc-c">
					<div class="w-ab-100 fd-r ai-c jc-b">
						<div class="section__title">
							{{ $t('home.news.title') }}
						</div>
						<LButton
							v-click-metrika="{
								name: 'xpp_main_news_more_click',
								exv: { place: 'main' },
							}"
							variant="accent"
							size="small"
							href="/news"
							>{{ $t('home.news.moreNews') }}</LButton
						>
					</div>
					<div
						:class="mobile ? 'scroll fd-r gp' : 'gap'"
						class="w-ab-100 mt-px-3-L mt-px-3-M mt-px-3-S mt-px-0 news-list">
						<LazyNewsCard
							v-for="article of news"
							:key="article._id"
							:is-horizontal-scroll="mobile"
							xm-name="xpp_main_news_click"
							:size="tablet ? 3 : 4"
							class="w-ab-100"
							:article="article" />
					</div>
				</div>

				<!-- About -->
				<section class="about">
					<figure class="about__logo">
						<img class="content-logo" :src="logo" alt="logo" />
					</figure>
					<h2 class="about__title">{{ $t('home.about.title') }}</h2>
					<p class="about__description">{{ $t('home.about.desc') }}</p>
					<div class="about__list">
						<div v-for="item of about" :key="`${item.id} about`" class="about__block">
							<div class="about__block-pic icon">
								<img class="w-ab-60" :src="item.picture" alt="icon" />
							</div>
							<h3 class="about__block-title">{{ $t(item.title) }}</h3>
							<p class="about__block-text">{{ $t(item.body) }}</p>
						</div>
					</div>
				</section>


			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import 'assets/css/ui';

.news-list {
	grid-template: 1fr / repeat(4, 1fr);

	@media (max-width: $max-mobile) {
		margin-top: 30px;
		grid-template: 1fr / 1fr;
	}
}

.section__title {
	font-family: var(--pilat-wide-font-family);
	font-weight: 700;
	font-size: 24px;
	line-height: 30px;
	text-transform: uppercase;
}

.games__list {
	margin-top: 30px;

	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 20px;

	@media (max-width: $max-tablet) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: $mid-mobile) {
		grid-template-columns: 1fr;
	}
}

.main {
	background: url('/background/about-background.png') no-repeat 100% 123%;
	background-size: 100% 40%;
}

.about {
	margin-top: 8%;
}

.about__logo {
	width: 130px;
	height: 101px;
	margin: 0 auto 50px;

	img {
		height: 100%;
		width: 100%;
	}
}

.about__title {
	margin: 0 auto 30px;
	text-align: center;
	font-style: normal;
	font-weight: 900;
	line-height: 50px;
	font-family: var(--pilat-wide-font-family);
	color: var(--white);
	text-transform: uppercase;
	font-size: 50px;

	@media screen and (max-width: 768px) {
		font-size: 38px;
		line-height: 38px;
	}
}

.about__description {
	max-width: 660px;
	margin: 0 auto 50px;
	color: #fff;
	text-align: center;
	font-size: 18px;
	font-style: normal;
	font-weight: 500;
	line-height: 28px;
	word-break: break-word;
	font-family: var(--helvetica-neue-font-family);
}

.about__list {
	display: flex;
	align-items: stretch;
	justify-content: space-between;
	gap: 20px;

	@media screen and (max-width: 768px) {
		flex-direction: column;
	}
}

.about__block {
	width: 32.3333333%;
	padding: 30px;
	box-sizing: border-box;
	background: linear-gradient(225deg, #9d65f9 0%, #8476fc 100%);
	background: var(--reskin-secondary-dark-color);

	@media screen and (max-width: 768px) {
		width: 100%;
		margin: 0 auto 20px;
	}
}

.about__block-pic {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60px;
	height: 60px;
	margin: 0 0 15px 0;
	border-radius: 10px;
	background-color: #ffffff;

	img {
		max-width: 36px;
		height: auto;
	}
}

.about__block-title {
	margin: 0 0 15px 0;
	font-size: 20px;
	font-style: normal;
	font-weight: 700;
	line-height: 20px;
	word-break: break-word;
	font-family: var(--pilat-wide-font-family);
}

.about__block-text {
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: 20px;
	color: #ffffff;
	word-break: break-word;
	font-family: var(--helvetica-neue-font-family);
}
</style>
