<script setup lang="ts">
import type { Banner } from '~/types';
import { onClickOutside } from '@vueuse/core';
import LButton from '~/components/base/v2/l-button.vue';
const emit = defineEmits(['close']);
const { banner } = defineProps<{ banner: Banner }>();

const bannerWrapper = ref(null);
onClickOutside(bannerWrapper, () => emit('close'));

async function sendPixelEvent(eventName: string) {
	// @ts-expect-error
	const pixel = window.pixel?.Views?.sessionViews;
	if (pixel) {
		pixel.triggerCustomEvent({
			eventName,
			ltg_source: banner.ltg_source,
		});
	}
}

async function onButtonClick() {
	await sendPixelEvent('ltg-banner-button-click');
	const router = useRouter();
	await router.push(banner.button.url);
	emit('close');
}

onMounted(async () => {
	localStorage.setItem(banner.ltg_source, '1');
	await sendPixelEvent('ltg-banner-open');
});
</script>

<template>
	<div class="banner">
		<article class="banner__wrapper" ref="bannerWrapper">
			<button class="close" @click="$emit('close')" aria-label="close">
				<IconX width="19" height="19" />
			</button>
			<div class="banner__columns">
				<div
					class="banner__column banner__column--image"
					:style="`background-image: url(${banner.image})`">
					<figure v-if="banner.game?.images?.logo" class="banner__logo">
						<img :src="banner.game.images.logo" width="206" height="278" alt="" />
					</figure>
				</div>
				<div class="banner__column banner__column--text">
					<h2 class="banner__title">{{ banner.title }}</h2>
					<p class="banner__description" v-html="banner.description"></p>

					<LButton v-if="banner.button?.url" variant="accent" @click="onButtonClick">
						{{ $t('promocodes.activate') }}
					</LButton>
				</div>
			</div>
		</article>
	</div>
</template>

<style scoped lang="scss">
@import 'assets/css/base.scss';
.banner {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9998;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: rgba(18, 15, 44, 0.8);
}

.banner__wrapper {
	position: relative;
	display: flex;
	align-items: stretch;
	width: 100%;
	max-width: 830px;
	height: min-content;
	min-height: 600px;
	background-color: #1a1736;

	@media screen and (max-width: $mid-mobile) {
		width: calc(100% - 50px);
		max-width: 560px;
	}

	@media (max-width: $max-tablet) {
		min-height: auto;
	}
}

.close {
	position: absolute;
	top: 25px;
	right: 25px;
	z-index: 9999;
	height: 30px;
	width: 30px;
}

.banner__columns {
	display: flex;
	align-items: stretch;
	justify-content: space-between;
	width: 100%;
	min-height: 100%;

	@media screen and (max-width: $mid-mobile) {
		flex-direction: column;
	}
}

.banner__column {
	width: 50%;
	flex-grow: 1;
	box-sizing: border-box;

	@media screen and (max-width: $mid-mobile) {
		width: 100%;
		flex: 1;
	}

	&--image {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 0 5% 50px;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center top;
		flex-basis: 300px;

		@media screen and (max-width: $mid-mobile) {
			padding: 5%;
		}
	}

	&--text {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 50px 25px 40px;
	}
}

.banner__logo {
	margin: 0;
	width: 85%;
	max-width: 206px;
	height: auto;
	text-align: center;

	img {
		display: block;
		width: 100%;
		height: auto;
	}
}

.banner__title {
	max-width: 350px;
	margin: 0 auto 25px;
	font-size: 20px;
	font-style: normal;
	font-weight: 700;
	line-height: 20px;
	color: #ffffff;
	text-align: center;
}

.banner__description {
	max-width: 350px;
	margin: 0 auto 30px;
	color: #a09cb9;
	font-size: 19px;
	font-style: normal;
	font-weight: 500;
	line-height: 33px;
	text-align: center;
	word-break: keep-all;
	white-space: pre-line;

	& + button {
		margin-top: auto;
	}

	@media screen and (max-width: $max-tablet) {
		font-size: 14px;
		line-height: 28px;
	}
}
</style>
