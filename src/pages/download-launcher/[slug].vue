<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAsyncData, useNuxtApp } from 'nuxt/app';
import StepToPlayCard from '~/components/download-launcher/step-to-play-card.vue';
import { stepsToPlay } from '~/components/download-launcher/data';
import useLauncherDownload from '~/composables/launcher-download';
import lottie from 'lottie-web';
import lottieArrowAnimationData from '../../assets/lottie/download-launcher/arrow.json';
import { HELP_CENTER_LINK } from '~/constants/common';
import { useI18n, Translation } from 'vue-i18n';

const LIFE_IS_FEUDAL_DISCORD_LINK = 'https://discord.gg/QDrMBsvGMg';
const LOTTIE_CONTAINER_ID = 'arrow-down-lottie-container';

const route = useRoute();
const { t } = useI18n();

const { handleLauncherDownload } = useLauncherDownload();

const showDiscordLink = computed(() => route.params.slug === 'life-is-feudal');

const downloadLauncher = async () => {
	const slug = route.params.slug as string;

	return await handleLauncherDownload(slug);
};

const { data: launcherDownloadData } = await useAsyncData(downloadLauncher, { server: false });

onMounted(() => {
	const lottieContainer = document.getElementById(LOTTIE_CONTAINER_ID);

	if (lottieContainer) {
		lottie.loadAnimation({
			container: lottieContainer,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			animationData: lottieArrowAnimationData,
		});
	}
});
</script>

<template>
	<!--	<div :class="$style['lottie-container']" :id="LOTTIE_CONTAINER_ID" />-->
	<div :class="$style.container">
		<p v-if="launcherDownloadData?.gameTitle" :class="$style['launcher-name']">
			{{ launcherDownloadData?.gameTitle }}
		</p>

		<h1 :class="$style.title">{{ t('downloadingLauncher.title') }}</h1>

		<p :class="$style['download-tip']">
			<Translation keypath="downloadingLauncher.note">
				<template v-slot:tryAgainButtonText>
					<button @click="downloadLauncher" :class="$style['try-again-button']">
						{{ t('downloadingLauncher.tryAgain') }}
					</button>
				</template>
			</Translation>
		</p>

		<section :class="$style['steps-to-play']">
			<StepToPlayCard v-for="(step, index) in stepsToPlay" :step="step" :key="index" />
		</section>

		<h2 :class="$style['help-section-title']">{{ t('downloadingLauncher.help.title') }}</h2>
		<p :class="$style['help-section-description']">
			{{ t('downloadingLauncher.help.description') }}
		</p>

		<NuxtLink target="_blank" :href="HELP_CENTER_LINK" :class="$style['help-link']">
			<img src="/socials/email.svg" alt="email" />
			Help Center
		</NuxtLink>

		<NuxtLink
			:href="LIFE_IS_FEUDAL_DISCORD_LINK"
			v-if="showDiscordLink"
			:class="$style['help-link']">
			<img src="/socials/discord.svg" alt="email" />
			Discord Chat
		</NuxtLink>
	</div>
</template>

<style module lang="scss">
.lottie-container {
	width: 197px;
	height: 197px;
	position: absolute;
	right: 37px;
	top: 0;
	/* TODO: remove transform and replace lottie data */
	transform: rotate(180deg);
}

.container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	max-width: 1300px;
	margin: 0 auto;
	align-items: center;
	padding: calc(var(--desktop-header-offset) + 100px) 0 160px;
}

.title,
.launcher-name {
	margin: 0 auto;
	text-align: center;
	max-width: 750px;
	font-size: 50px;
	font-weight: 900;
	line-height: 97.5%;
	text-transform: uppercase;
	font-family: var(--pilat-wide-font-family);
	color: var(--reskin-primary-light-text-color);
	width: 100%;
}

.launcher-name {
	width: 100%;
	margin-bottom: 30px;
}

.download-tip {
	/* TODO: add inter font family */
	margin-top: 30px;
	width: 100%;

	&,
	& .try-again-button {
		font-size: 18px;
		font-weight: 500;
		line-height: 28px;
		text-align: center;
		color: var(--reskin-primary-light-text-color);
	}

	& .try-again-button {
		color: #6e7bf7;
		text-decoration: underline;
	}
}

.steps-to-play {
	margin-top: 50px;
	display: flex;
	gap: 20px;
}

.help-section-title {
	margin-top: 100px;
	font-size: 46px;
	font-weight: 800;
	line-height: 44px;
	color: var(--primary-light-text-color);
	text-align: center;
	width: 100%;
}

.help-section-description {
	margin-top: 16px;
	color: var(--primary-light-text-color);
	font-weight: 700;
	font-size: 24px;
	line-height: 30px;
	text-align: center;
	width: 100%;
}

.help-link {
	margin-top: 50px;
	background: #161d45;
	padding: 24px 32px;
	font-family: var(--pilat-wide-font-family);
	font-weight: 600;
	font-size: 28px;
	line-height: 36px;
	color: var(--primary-light-text-color);
	display: flex;
	flex-direction: row;
	flex: 1;
	gap: 15px;
	align-items: center;

	& > img {
		width: 24px;
		height: 24px;
	}

	&:not(:last-of-type) {
		margin-right: 20px;
	}

	&:first-of-type:last-of-type {
		max-width: calc(50% - 20px);
		margin: 50px auto 0;
	}
}
</style>
