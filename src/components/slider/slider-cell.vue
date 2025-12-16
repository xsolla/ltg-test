<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';
import LButton from '~/components/base/v2/l-button.vue';
import LPicture from '~/components/base/l-picture.vue';

const { mobile, tablet } = useMobileTablet();
const currentHost = "ltg.com";

const getTarget = (url) => {
	try {
		// Если без http, оставляем `target="_self"`
		if (!url.startsWith("http")) return "_self";

		// Получаем хост из URL
		const linkHost = new URL(url).hostname;

		// Если хост совпадает с `ltg.com`, оставляем `target="_self"`
		return linkHost === currentHost ? "_self" : "_blank";
	} catch (e) {
		return "_self";
	}
};
</script>
<template>
	<transition name="hero">
		<div v-if="active" class="w-ab-100 h-ab-100 fd-c ai-c p-a">
			<div
				class="w-ab-100 h-ab-160-L h-ab-120-XM h-ab-140-M h-ab-140-S h-ab-140 no-select of-h p-a t-0 slider-cell-shadow">
				<div class="w-ab-100 h-ab-100 anim">
					<LPicture
						alt="slider-picture"
						:src="mobile ? slider.images.mobile : slider.images.desktop"
						variant="full-height"
						object-fit="cover" />
				</div>
			</div>

			<div class="p-a t-0 fd-c jc-b mt-px-14 mt-px-8-S mt-px-10-M mt-px-15-XM container">
				<div class="w-ab-75-S w-ab-100 fd-c">
					<div class="name">
						{{ slider.name }}
					</div>
					<div class="title">
						{{ slider.title }}
					</div>
					<div class="text">
						{{ slider.text }}
					</div>
				</div>
				<div class="mt-5-M mt-10 fd-r ai-c button-container" v-if="!mobile">
					<!--					TODO: completely remove or refactor to LButton after discussion-->
					<!--					<BaseButton-->
					<!--						v-if="slider.downloadLink"-->
					<!--						class="mr-2"-->
					<!--						large-->
					<!--						:to="slider.downloadLink"-->
					<!--						>{{ $t('home.sliders.downloadNow') }}</BaseButton-->
					<!--					>-->
					<LButton
						v-if="slider.learnMoreLink"
						:href="slider.learnMoreLink"
						v-click-metrika="{
							name: 'xpp_main_learn_more_click',
							exv: { type: slider.type },
							ev: slider._id,
						  }"
						variant="accent-gradient"
						:target="getTarget(slider.learnMoreLink)"
						:rel="getTarget(slider.learnMoreLink) === '_blank' ? 'noopener noreferrer' : ''"
					>
						{{ $t('home.sliders.learnMore') }}
					</LButton>
				</div>
				<div class="mt-5-M mt-10 ai-c button-container" v-if="mobile">
					<!--					TODO: completely remove or refactor to LButton after discussion-->
					<!--					<BaseButton-->
					<!--						v-if="slider.downloadLink"-->
					<!--						class="w-ab-100 mb-10 mr-2"-->
					<!--						large-->
					<!--						:to="slider.downloadLink"-->
					<!--						>{{ $t('home.sliders.downloadNow') }}</BaseButton-->
					<!--					>-->
					<LButton
						v-if="slider.learnMoreLink"
						:href="slider.learnMoreLink"
						v-click-metrika="{
							name: 'xpp_main_learn_more_click',
							exv: { type: slider.type },
							ev: slider._id,
						  }"
						variant="accent-gradient"
						:target="getTarget(slider.learnMoreLink)"
						:rel="getTarget(slider.learnMoreLink) === '_blank' ? 'noopener noreferrer' : ''"
					>
						{{ $t('home.sliders.learnMore') }}
					</LButton>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import BaseButton from '@/components/base/base-button.vue';
export default {
	name: 'SliderCell',
	components: { BaseButton },
	props: {
		slider: {
			type: Object,
			default: () => {},
		},

		active: Boolean,
	},
	computed: {
		imageSrc() {
			return this.mobile ? this.slider.images.mobile : this.slider.images.desktop;
		},
	},
	mounted() {
		this.slider.type = this.slider?.learnMoreLink?.includes('\/news\/') ? 'news' : 'game';
	},
};
</script>

<style lang="scss" scoped>
@import 'assets/css/variables';

.slider-cell-shadow {
	background: #120f2c;

	&:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 20vh;
		background: linear-gradient(
			180deg,
			rgba(19, 16, 45, 0) 0%,
			var(--primary-dark-text-color) 100%
		);
	}
}
.name {
	font-family: var(--pilat-wide-font-family);
	font-weight: 900;
	font-size: 24px;
	line-height: 30px;
	color: var(--white-50);

	@media (max-width: $mid-tablet) {
		margin-top: 10px;
		font-size: 20px;
	}
}
.anim {
	animation: anim 7s ease-in-out;
}

.title,
.text {
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.title {
	-webkit-line-clamp: 2;
	margin-top: 20px;

	font-family: var(--pilat-wide-font-family);
	font-weight: 900;
	font-size: 60px;
	line-height: 77px;

	@media (max-width: $mid-tablet) {
		margin-top: 10px;
		font-size: 40px;
		line-height: 50px;
	}
}
.text {
	-webkit-line-clamp: 3;
	margin-top: 20px;

	font-family: var(--helvetica-neue-font-family);
	font-weight: 400;
	font-size: 18px;
	line-height: 28px;

	@media (max-width: $mid-tablet) {
		margin-top: 10px;
		font-size: 16px;
		line-height: 24px;
	}
}

.button-container {
	@media (max-width: $mid-tablet) {
		margin-top: 20px;
	}

	@media (max-width: $max-mobile) {
		margin-top: 60px;
	}
}

@keyframes anim {
	0% {
		transform: scale(1.1) translateY(0);
	}
	100% {
		transform: scale(1) translateY(-1rem);
	}
}

.title,
.text {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.title {
	-webkit-line-clamp: 2;
}
.text {
	-webkit-line-clamp: 3;
}
</style>
