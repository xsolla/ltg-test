<script setup lang="ts">
import ArdenFeaturesSlider from '~/components/game/arden/arden-features-slider.vue';
import {
	IconFacebook,
	IconDiscord,
	IconTwitter,
	IconYoutube,
	IconTwitch,
	IconReddit,
} from '#components';
import StagesBar from '@/components/lif-stages-bar.vue';
import useMobileTablet from '~/composables/mobile-tablet-desktop';
import type { GameArticle, UserData, FullGame } from '~/types';
import type { GameKeyPackageItem } from '@/types/arden';
import useLauncherDownload from '~/composables/launcher-download';
import { computed } from 'vue';

const { $api } = useNuxtApp();
const { t } = useI18n();
const { mobile, tablet } = useMobileTablet();
const socials = [
	{
		name: 'facebook',
		link: 'https://www.facebook.com/LiF.MMO/',
		icon: IconFacebook,
	},
	{
		name: 'discord',
		link: 'https://discord.gg/QDrMBsvGMg',
		icon: IconDiscord,
	},
	{
		name: 'twitter',
		link: 'https://twitter.com/lifeisfeudalmmo',
		icon: IconTwitter,
	},
	{
		name: 'youtube',
		link: 'https://www.youtube.com/channel/UCy8xv8xyyIoxxUNH7nrWDNQ',
		icon: IconYoutube,
	},
	{
		name: 'twitch',
		link: 'https://www.twitch.tv/longtalegames',
		icon: IconTwitch,
	},
	{
		name: 'reddit',
		link: 'https://www.reddit.com/r/Life_Is_Feudal_MMO/',
		icon: IconReddit,
	},
];
const codes = ref<GameKeyPackageItem[]>([]);
const game = ref<FullGame | null>(null);

const user = useState<{ data?: UserData }>('user');

async function getCodes() {
	codes.value = [];
	if (!user.value) return;

	const result = await $api.getUserFiendCodes();
	if (result.length === 0) return;

	result.forEach((packCodes) => {
		codes.value.push(...packCodes.codes);
	});
}

const showCodesPopup = ref(false);

function openCodesPopup() {
	showCodesPopup.value = true;
	document.body.classList.add('lock');
}

function closeCodesPopup() {
	showCodesPopup.value = false;
	document.body.classList.remove('lock');
}

const getGame = async () => {
	game.value = (await $api.getGame('life-is-feudal-arden', '')) as FullGame;
};

const articles = ref<GameArticle[] | []>();

const { handleDownloadPageNavigation } = useLauncherDownload();
const downloadLauncher = () => {
	handleDownloadPageNavigation('life-is-feudal-arden' as string);
};

const hasCBTAccess = useState<boolean>('has-cbt-access');

onMounted(async () => {
	if (hasCBTAccess.value === false) {
		return navigateTo('/game/life-is-feudal-arden');
	}

	await getGame();

	if (game.value?._id) {
		articles.value = (await $api.getGameArticles(game.value?._id)) as GameArticle[];
	}


	setTimeout(async () => {
		const metaframe = document.getElementById('#__metaframe');
		if (metaframe) metaframe.classList.add('thank-you-page');
	}, 5000);
});

if (!useCookie(authTokenCookieKey).value) {
	await navigateTo('/game/life-is-feudal-arden');
}
const desc_ea_how_to_22 = computed(() => {
	return t('arden-index.desc_ea_how_to_22', {
		cross_auth_link: '<a href="https://ltg.com/news/2024/cross-authorization-for-life-is-feudal-mmo" target="_blank" style="color:#db9909;">' + t('arden-index.desc_ea_how_to_22_link') + '</a>'
	})
});
const desc_ea_how_to_21 = computed(() => {
	return t('arden-index.desc_ea_how_to_21', {
		launcherLink: '<a href="https://ltg.com/download-launcher/life-is-feudal-arden" target="_blank" style="color:#db9909">LTG Launcher</a>',
		steamLink: '<a href="https://store.steampowered.com/app/3285700/Life_is_Feudal_Arden/" target="_blank" style="color:#db9909">Steam</a>',
		egs: '<a href="https://store.epicgames.com/p/life-is-feudal-arden-cf3baa" target="_blank" style="color:#db9909">EGS</a>',
	});
});


</script>

<template>
	<div class="bg-cbt" style="padding-bottom: 0">
		<section class="hero">
			<div class="compact-container">
				<h1 class="hero__title">{{ t('arden-index.title_ea_how_to_1') }}</h1>
				<div class="hero__description">
					<p>{{ t('arden-index.desc_ea_how_to_11') }}</p>
				</div>
				<h2 class="hero__subtitle">{{ t('arden-index.title_ea_how_to_2') }}</h2>
				<div class="hero__description">
					<p v-html="desc_ea_how_to_21"></p>
					<p v-html="desc_ea_how_to_22"></p>
					<p>&nbsp;</p>
					<p>{{ t('arden-index.desc_ea_how_to_23') }}</p>
					<p>&nbsp;</p>
				</div>
				<div class="hero__cta">
					<LifButton
						:buttonText="t('arden-index.download_launcher')"
						class="lif-button--yellow lif-button--large"
						@click="downloadLauncher" />
					<p></p>
				</div>

				<div class="social">
					<h3 class="social__title">
						{{ t('arden-index.social_title') }}
					</h3>
					<ul class="list-reset social__list">
						<LifSocial v-for="social in socials" :key="social.name" :social="social" />
					</ul>
				</div>
			</div>
		</section>
		<article class="banner-codes" v-if="false">
			<h3 class="title title--minor banner-codes__title">
				{{ t('arden-index.friend_code_text') }}
			</h3>
			<LifButton
				:buttonText="t('arden-index.friend_code_btn')"
				class="lif-button--yellow lif-button--xlarge banner-codes__button"
				@click="openCodesPopup" />
		</article>

		<GameArdenPacksList :game="game" />

		<section class="stages">
			<div class="compact-container">
				<h2 class="title title--major">{{ t('arden-index.stage_title') }}</h2>
				<StagesBar />
			</div>
		</section>

		<section class="features">
			<div class="features-1">
				<h2 class="title title--major">{{ t('arden-index.feature_title') }}</h2>
				<div class="compact-container">
					<div class="about__feature">
						<div class="about__feature-col about__feature-col--left">
							<img
								src="https://cdn.ltg.com/lif/images/arden/about-people_1.png"
								width="643"
								height="1099"
								alt="lif people" />
						</div>
						<div class="about__feature-col about__feature-col--right">
							<h3 class="about__feature-title">
								{{ t('arden-index.feature_title_1') }}
							</h3>
							<div class="about__feature-image">
								<div class="mask-wrapper">
									<div class="video">
										<video ref="gifVideo" autoplay loop muted playsinline>
											<source
												src="https://cdn.ltg.com/lif/images/features/gifs/ARDEN_GIF_PERSON.mp4"
												type="video/mp4" />
											<source
												src="https://cdn.ltg.com/lif/images/features/gifs/ARDEN_GIF_PERSON.webm"
												type="video/webm" />
											Your browser doesn't support HTML5 video tag.
										</video>
									</div>
									<div class="mask">
										<LifVideoMask />
									</div>
								</div>
							</div>
							<div class="about__feature-description">
								<p>
									{{ $t('arden-index.feature_text_1') }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="features-2">
				<div class="compact-container">
					<div class="about__feature about__feature--reverse">
						<div class="about__feature-col about__feature-col--left">
							<img
								src="https://cdn.ltg.com/lif/images/arden/about-people_2.png"
								width="738"
								height="926"
								alt="lif people" />
						</div>
						<div class="about__feature-col about__feature-col--right">
							<h3 class="about__feature-title">
								{{ t('arden-index.feature_title_2') }}
							</h3>
							<div class="about__feature-image">
								<div class="mask-wrapper">
									<div class="video">
										<video ref="gifVideo" autoplay loop muted playsinline>
											<source
												src="https://cdn.ltg.com/lif/images/features/gifs/ARDEN_GIF_ARCHERS.mp4"
												type="video/mp4" />
											<source
												src="https://cdn.ltg.com/lif/images/features/gifs/ARDEN_GIF_ARCHERS.webm"
												type="video/webm" />
											Your browser doesn't support HTML5 video tag.
										</video>
									</div>
									<div class="mask">
										<LifVideoMask />
									</div>
								</div>
							</div>
							<div class="about__feature-description">
								<p>
									{{ t('arden-index.feature_text_2') }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="features features--arden">
			<ArdenFeaturesSlider ref="slider" class="slider" />
		</section>

		<div class="bg-news-cta">
			<section class="news">
				<div class="compact-container">
					<h2 class="title title--major">{{ t('game.news') }}</h2>
					<div v-if="articles?.length" class="news-container">
						<div :class="mobile ? 'scroll fd-r gp' : 'gap'" class="news-list">
							<NewsCard
								v-for="article in articles"
								:key="article?._id"
								target="_blank"
								xm-name="xpp_game_news_click"
								:is-horizontal-scroll="mobile"
								:size="tablet ? 2 : 3"
								class="w-ab-100 cbt-style"
								:article="article" />
						</div>
					</div>
				</div>
			</section>

			<section class="cta">
				<div class="compact-container">
					<h2 class="title title--minor" v-if="false">
						{{ t('arden-index.friend_code_text') }}
					</h2>
					<LifButton
						v-if="false"
						:buttonText="t('arden-index.download_launcher')"
						class="lif-button--yellow lif-button--large"
						@click="downloadLauncher" />
					<div class="social">
						<h3 class="social__title">
							{{ t('arden-index.social_title') }}
						</h3>
						<ul class="list-reset social__list">
							<LifSocial
								v-for="social in socials"
								:key="social.name"
								:social="social" />
						</ul>
					</div>
				</div>
			</section>
		</div>

	</div>
</template>

<style scoped lang="scss">
p {
	word-break: normal;
}
html,
body {
	font-family: 'Ubuntu', sans-serif;
	font-size: 16px !important;
}

.bg-cbt {
	background: #131313;
}

.title {
	margin: 0;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 400;
	text-transform: uppercase;
	text-align: center;
	color: #ffffff;

	&--major {
		font-size: 50px;
		line-height: 54px;

		@media screen and (max-width: 768px) {
			font-size: 40px;
			line-height: 48px;
		}
	}

	&--minor {
		font-size: 40px;
		line-height: 43px;
	}
}

.compact-container {
	width: 100%;
	max-width: 1130px;
	margin: 0 auto;

	@media screen and (max-width: 1200px) {
		padding: 0 20px;
	}
}
.compact-container-packs {
	position: absolute;
	width: 100%;
	height: 90%;
	max-width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;

	.compact-container__wrap {
		width: 100%;
	}
	@media screen and (max-width: 1024px) {
		width: initial;
		height: initial;
		position: relative;
		max-width: 100%;
	}
}

.hero {
	position: relative;
	min-height: 80vh;
	padding: 192px 0 70px 0;
	background-color: #3a3a38;
	background-image: url('https://cdn.ltg.com/lif/images/cbt/hero-bg.jpg');
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;

	&:before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0) -0.91%, #000000 84.09%);
	}

	.lif-button {
		width: 201px;
		height: 82px;
		background-color: #131313;
		background-image: url('https://cdn.ltg.com/lif/images/cbt/button-two-row.png');
		background-size: 187px 82px;

		&:hover {
			background-image: url('https://cdn.ltg.com/lif/images/cbt/button-two-row-hover.png');
		}
	}

	@media screen and (max-width: 768px) {
		background-image: url('https://cdn.ltg.com/lif/images/cbt/hero-bg-mobile.jpg');
	}

	.compact-container {
		@media screen and (max-width: 768px) {
			padding: 0;
		}
	}
}

.hero__title {
	max-width: 100%;
	margin: 0 0 20px 0;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 400;
	font-size: 50px;
	line-height: 54px;
	text-transform: uppercase;
	color: #ffffff;

	@media screen and (max-width: 768px) {
		padding: 0 20px;
		font-size: 40px;
		line-height: 50px;
	}
}
.hero__subtitle {
	max-width: 100%;
	margin: 0 0 0px 0;
	font-style: normal;
	font-weight: 700;
	font-size: 20px;
	line-height: 1.5;
	color: #ffffff;

	@media screen and (max-width: 768px) {
		padding: 0 20px;
		font-size: 16px;
	}
}

.hero__description {
	max-width: 800px;
	margin: 0 0 30px 0;
	font-family: 'Ubuntu', sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 20px;
	line-height: 30px;
	color: #ffffff;

	@media screen and (max-width: 768px) {
		margin: 0 0 20px 0;
		padding: 0 20px;
	}
}

.hero__cta {
	display: flex;
	align-items: center;
	gap: 32px;
	max-width: 50%;
	margin: 0 0 72px 0;

	button {
		width: 194px;
		height: 74px;
		border-radius: 0;

		@media screen and (max-width: 768px) {
			display: none;
		}
	}

	p {
		width: auto;
		margin: 0;
		font-family: 'Ubuntu', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 20px;
		color: #ffffff;

		@media screen and (max-width: 768px) {
			color: #ffa800;
		}
	}

	@media screen and (max-width: 768px) {
		max-width: 100%;
		margin: 0 0 50px 0;
		padding: 0 20px;
	}
}

.social {
	position: relative;
	padding: 50px 0;

	&:before,
	&:after {
		display: none;
		content: '';
		position: absolute;
		width: 320px;
		height: 24px;
		background-image: url(https://cdn.ltg.com/lif/images/cbt/decor-social-mobile.png);
		background-repeat: no-repeat;
		background-size: 320px 24px;
		transform: translateX(-50%);

		@media screen and (max-width: 768px) {
			display: block;
		}
	}

	&:before {
		top: 0;
		left: 50%;
	}

	&:after {
		bottom: 0;
		left: 50%;
	}
}
.bg-news-cta {
	.social {
		padding-bottom: 150px;
	}
}
.social__title {
	margin: 0 auto 20px;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 400;
	font-size: 20px;
	line-height: 22px;
	text-align: center;
	text-transform: uppercase;
	color: #ffffff;
}

.social__list {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24px;
	padding: 0;
	margin: 0;
	list-style: none;
}

.banner-codes {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 50px;
	width: 100%;
	max-width: 890px;
	margin: 100px auto 0;
	padding: 46px 50px;
	background-image: url('https://cdn.ltg.com/lif/images/cbt/banner-bg.png');
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;

	.lif-button {
		position: relative;
		z-index: 2;
		width: 246px;
		height: 70px;
	}

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		background-image: url('https://cdn.ltg.com/lif/images/cbt/banner-bg.png');
		background-size: cover;
		background-position: center top;
		background-repeat: no-repeat;

		@media screen and (max-width: 768px) {
			display: none;
		}
	}

	&::after {
		content: '';
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 0;
		width: 100%;
		max-width: 994px;
		height: 70%;
		max-height: 187px;
		background: rgba(255, 0, 0, 0.19);
		filter: blur(50px);

		@media screen and (max-width: 768px) {
			display: none;
		}
	}

	.lif-button {
		width: 240px;
		height: 76px;
		background-color: #000000;
		background-size: 240px 76px;
	}

	@media screen and (max-width: 768px) {
		flex-direction: column;
		margin: 50px auto 0;
		background-image: url('https://cdn.ltg.com/lif/images/cbt/banner-codes-bg-mobile.png');
		background-position: right top;
	}
}

.banner-codes__title {
	position: relative;
	z-index: 2;
	width: calc(100% - 286px);
	text-align: left;

	@media screen and (max-width: 768px) {
		width: 100%;
		text-align: center;
	}
}

.banner-codes__button {
	.lif-button__text {
		font-size: 25px !important;
	}
}

.card-pack {
	.lif-button {
		span {
			font-size: 18px !important;
		}
	}
}

.stages {
	position: relative;
	z-index: 2;
	padding-top: 40vh;
	padding-bottom: 10vh;
	margin-top: -40vh;
	overflow: hidden;
	background-color: #000000;

	&::after {
		content: '';
		position: absolute;
		top: -20vh;
		left: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		transform: scale(1.5);
		background-image: url('https://cdn.ltg.com/lif/images/cbt/stages-bg.png');
		background-size: cover;
		background-position: center top;
		background-repeat: no-repeat;
	}

	.title {
		max-width: 512px;
		margin: 0 auto 75px;
	}

	.compact-container {
		position: relative;
		z-index: 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
}

.features {
	background-color: #0c0e0d;

	.title {
		position: relative;
		z-index: 10;
		margin: 0 auto 50px;

		@media screen and (max-width: 1024px) {
			padding-left: 20px;
			padding-right: 20px;
		}
	}
}

.features-1 {
	position: relative;
	z-index: 3;
	padding-top: 40vh;
	margin-top: -15vh;
	padding-bottom: 10px;

	&:before {
		content: '';
		position: absolute;
		z-index: 10;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 35%;
		background: linear-gradient(0deg, rgb(12, 14, 13) 40%, rgba(0, 0, 0, 0.0705882353) 100%);
	}

	&:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		background-image: url('https://cdn.ltg.com/lif/images/cbt/bg-feature-1.png');
		background-size: cover;
		background-position: center top;
		background-repeat: no-repeat;
	}

	@media screen and (max-width: 1024px) {
		padding-top: 34vh;
	}
}

.features-2 {
	position: relative;
	min-height: 70vh;
	padding-top: 20px;
	padding-bottom: 30px;
	background-color: #000000;
	background-image: url('https://cdn.ltg.com/lif/images/cbt/bg-feature-2.jpg');
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 50%;
		background: linear-gradient(180deg, rgba(19, 15, 22, 0) 0%, #0c0e0d 100%);
		transform: matrix(1, 0, 0, -1, 0, 0);
	}

	&:after {
		content: '';
		position: absolute;
		z-index: 10;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 35%;
		background: linear-gradient(0deg, rgb(12 14 13) 46%, rgba(0, 0, 0, 0.0705882353) 100%);
	}

	.compact-container {
		padding: 0;
	}
}

.about__feature {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;

	&--reverse {
		.about__feature-col--left {
			position: relative;
			transform: translateX(-44px);
			width: 55%;
			z-index: 10;
			order: 2;

			@media screen and (max-width: 1024px) {
				transform: none;
				order: 1;
				width: 100%;
				height: 77vh;
				overflow: hidden;
				position: absolute;
				top: 0;
			}

			img {
				@media screen and (max-width: 1024px) {
					width: 150%;
					transform: translateX(-25%);
				}
			}
		}

		.about__feature-col--right {
			order: 1;
			width: 45%;

			.about__feature-col img {
				position: relative;
				z-index: -1;
			}

			@media screen and (max-width: 1024px) {
				order: 2;
				position: relative;
				z-index: 100;
				width: 100%;
			}
		}

		.about__feature-title,
		.about__feature-description {
			text-align: right;
			@media screen and (max-width: 1024px) {
				text-align: left;
			}
		}

		@media screen and (max-width: 1024px) {
			padding-top: 40vh;
			padding-left: 20px;
			padding-right: 20px;
		}
	}

	@media screen and (max-width: 1024px) {
		flex-direction: column;
		padding-top: 35vh;
	}
}

.about__feature-col {
	img {
		position: relative;
		z-index: 5;
		width: 100%;
		height: auto;
		display: block;
		object-fit: contain;
	}

	&--left {
		transform: translateX(40px);
		width: 45%;
		z-index: 7;

		@media screen and (max-width: 1024px) {
			position: absolute;
			top: 0;
			width: 100%;
			height: 77vh;
			overflow: hidden;
			transform: none;
		}
	}

	&--right {
		width: 55%;

		@media screen and (max-width: 1024px) {
			position: relative;
			z-index: 100;
			width: 100%;
		}
	}
}

.about__feature-title {
	position: relative;
	z-index: 25;
	margin: 0 0 30px 0;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 400;
	font-size: 40px;
	line-height: 43px;
	color: #ffffff;

	@media screen and (max-width: 1024px) {
		font-size: 30px;
		line-height: 110%;
	}
}

.about__feature-image {
	width: 100%;
	filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.8));

	.mask {
		position: absolute;
		top: 0;
	}

	.mask-wrapper {
		aspect-ratio: 16 / 9;
		width: 100%;
		height: 100%;
	}

	.video {
		width: 100%;
		height: 100%;
		clip-path: url(#mask);
	}

	.video iframe,
	.video video {
		width: 100%;
	}
}

.about__feature-description {
	position: relative;
	z-index: 25;
	font-family: 'Ubuntu', sans-serif;
	font-style: normal;
	font-weight: 300;
	font-size: 20px;
	line-height: 160%;
	color: #ffffff;
	margin-top: 20px;
	p {
		font-family: 'Ubuntu', sans-serif;
		font-style: normal;
		font-weight: 300;
		font-size: 20px;
		line-height: 160%;
		color: #ffffff;
	}
}

.news {
	padding: 10px 0 116px 0;

	.title {
		@media screen and (max-width: 768px) {
			margin-bottom: 40px;
		}
	}

	.news-container {
		margin-top: 30px;
	}
}

.cta {
	.title {
		margin: 0 auto 32px;
	}

	.lif-button {
		width: 100%;
		max-width: 324px;
		height: 72px;
		margin: 0 auto 90px;
		background-size: 324px 72px;
	}

	.compact-container {
		@media screen and (max-width: 768px) {
			padding-bottom: 140px;
		}
	}
}

.bg-news-cta {
	height: 100%;
	background-color: #000000;
	background-image: url('https://cdn.ltg.com/lif/images/cbt/bg-news-cta.png');
	background-size: cover;
	background-position: top center;
}

.popup {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 8000;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	.lif-button {
		width: 140px;
		height: 46px;
		background-size: 140px 46px;
	}

	&--pack {
		.popup__dialog {
			width: 100%;
			max-width: 540px;
			height: 90vh;
			max-height: 740px;
		}

		.popup__body {
			height: calc(100% - 102px - 86px);
			overflow: scroll;
		}

		.card-pack__tool-name {
			display: block;
			margin: 0 auto 10px;
			text-align: center;
		}

		.card-pack__tools {
			background-color: #000000;
			background-image: none;
		}

		.card-pack__tool {
			margin-bottom: 30px;

			&:last-child {
				margin-bottom: 10px;
			}
		}

		.popup__header {
			flex-direction: column;
			align-items: flex-start;
			padding: 0 20px;
			background-image: none;
		}

		.popup__footer {
			justify-content: space-between;
		}

		.card-pack__tool-name,
		.card-pack__option span {
			color: #ffffff;
			text-shadow: none;
		}

		&.pack-true {
			.popup__header {
				background-image: url('https://cdn.ltg.com/lif/images/cbt/pack-true-bg-header.png');
			}
		}

		&.pack-zealous {
			.popup__header {
				min-height: 140px;
				background-image: url('https://cdn.ltg.com/lif/images/cbt/pack-zealous-bg-header.png');
			}

			.popup__body {
				height: calc(100% - 140px - 86px);
			}
		}

		&.pack-devoted {
			.popup__header {
				background-image: url('https://cdn.ltg.com/lif/images/cbt/pack-devoted-bg-header.png');
			}
		}

		.card-pack__price {
			@media screen and (max-width: 768px) {
				font-size: 22px;
				line-height: 24px;
			}

			@media screen and (max-width: 480px) {
				font-size: 18px;
				line-height: 20px;
			}
		}

		.lif-button {
			width: 140px;
			height: 46px;
			background-size: 140px 46px;

			@media screen and (max-width: 768px) {
				width: 136px;
				height: 46px;
				background-size: 136px 46px;
			}

			@media screen and (max-width: 480px) {
				width: 100px;
				height: 46px;
				padding: 10px 5px;
				background-size: 100px 46px;
			}
		}
	}

	&--codes {
		.popup__dialog {
			width: 100%;
			max-width: 800px;
			height: 70vh;
			max-height: 530px;

			@media screen and (max-width: 768px) {
				width: 90%;
				max-width: 700px;
			}
		}

		.popup__body {
			height: calc(100% - 100px - 86px);
		}

		.popup__footer {
			justify-content: center;
		}
	}

	@media screen and (max-width: 768px) {
		padding: 0 20px;
	}
}

.popup__overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);

	@media screen and (max-width: 768px) {
		background-color: rgba(0, 0, 0, 0.9);
	}
}

.popup__dialog {
	width: 100%;
	max-width: 540px;
	background-color: #000000;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 5px;
	overflow: hidden;
}

.popup__header {
	position: relative;
	min-height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px 5px 0 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	overflow: hidden;
	background-image: url('https://cdn.ltg.com/lif/images/16/popup-header-bg.png'),
		url('https://cdn.ltg.com/lif/images/16/popup-header-decor-left_2.png'),
		url('https://cdn.ltg.com/lif/images/16/popup-header-decor-right_2.png');
	background-repeat: no-repeat;
	background-size:
		cover,
		90px 135px,
		90px 135px;
	background-position:
		center top,
		top 20px left 5%,
		top 20px right 5%;

	h2 {
		position: relative;
		z-index: 5;
		width: 100%;
		min-width: 220px;
		max-width: 255px;
		margin: 0;
		font-family: 'Ubuntu', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 28px;
		line-height: 28px;
		text-align: center;
		color: #db9909;
	}
}

.popup__close {
	position: absolute;
	top: 6px;
	right: 6px;
	width: 16px;
	height: 16px;
	background: none;
	border: none;
	cursor: pointer;

	svg {
		width: 10px;
		height: 10px;

		path {
			fill: #db9909;
			transition: fill linear 0.2s;
		}
	}

	&:hover {
		path {
			fill: #b50000;
		}
	}
}

.popup__footer {
	position: relative;
	min-height: 92px;
	display: flex;
	align-items: center;
	padding: 0 20px;
	border-radius: 0 0 5px 5px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	background-image: url('https://cdn.ltg.com/lif/images/16/popup-header-bg.png');
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center top;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-size: cover;
	}
}

.popup__body {
	padding: 50px 45px 45px 45px;
	overflow: auto;

	p {
		margin: 0 auto 40px;
		font-family: 'Ubuntu', sans-serif;
		font-style: normal;
		font-weight: 300;
		font-size: 16px;
		line-height: 26px;
		color: #ffffff;
	}

	@media screen and (max-width: 768px) {
		padding: 20px 35px 20px 35px;
	}
}

.popup__button {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px;
}

.codes {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20px 30px;

	@media screen and (max-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}
}

.card.cbt-style {
	&:before {
		background-color: #262323 !important;
	}

	.content-wrapper {
		p.project-name {
			color: #ffc148 !important;
		}
	}
}
.features {
	min-height: 800px;

	background-color: #000000;
	background-image: url('https://cdn.ltg.com/lif/images/cbt/bg-news-cta.png');
	background-size: cover;
	background-position: top center;
}
</style>
