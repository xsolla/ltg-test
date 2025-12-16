<script setup>
import LButton from '~/components/base/v2/l-button.vue';
import useMobileTablet from '@/composables/mobile-tablet-desktop';

const { mobile } = useMobileTablet();
const fullscreenEnabled = useState('fullscreen-enabled');

watch(fullscreenEnabled, (value) => {
	document.querySelector('html, body').style.overflow = value ? 'hidden' : 'auto';
});

onBeforeUnmount(() => {
	fullscreenEnabled.value = false;
	document.querySelector('html, body').style.overflow = 'auto';
});
</script>
<template>
	<Teleport to="body" :disabled="!fullscreenEnabled">
		<div class="game-gallery" :class="{ 'fullscreen-carousel': fullscreenEnabled }">
			<div class="game-gallery__outer">
				<div v-if="fullscreenEnabled" class="fullscreen-carousel__bg"></div>

				<button
					v-if="fullscreenEnabled"
					class="fullscreen-carousel__close"
					@click="fullscreenEnabled = false">
					<img src="/icons/close.svg" alt="close" />
				</button>

				<div v-if="!fullscreenEnabled" class="game-gallery__tabs">
					<LButton
						v-if="gallery.showScreenshots && gallery.showVideos"
						:variant="screenshotsButtonVariant"
						@click="setGallery('screenShots')">
						{{ $t('game.screenshots') }}
					</LButton>
					<LButton
						v-if="gallery.showVideos"
						:variant="videosButtonVariant"
						@click="setGallery('videos')">
						{{ $t('game.videos') }}
					</LButton>
				</div>

				<div
					v-if="galleryContent && galleryContent.length"
					class="game-gallery__inner"
					:class="{ '': fullscreenEnabled }">
					<div
						v-if="!fullscreenEnabled"
						ref="carousel"
						:class="{ 'more-one': 'less-one' }"
						class="carousel carousel--main">
						<div class="overlay"></div>
						<CarouselElement
							v-for="(src, slideIndex) of galleryContent"
							:key="`Slide ${slideIndex}`"
							:gallery-count="galleryContent?.length"
							:slide-index="slideIndex"
							:src="src"
							:active="slideIndex === activeIndex"
							@click="setActiveIndex(slideIndex)" />
					</div>
					<div v-if="fullscreenEnabled" ref="carousel" class="carousel carousel--full">
						<CarouselElement
							v-for="(src, slideIndex) of galleryContent"
							:key="`Slide ${slideIndex}`"
							:gallery-count="galleryContent?.length"
							:slide-index="slideIndex"
							:src="src"
							:active="slideIndex === activeIndex"
							fullscreen
							@click="setActiveIndex(slideIndex)" />
					</div>

					<div ref="thumbnails" class="carousel carousel--thumb">
						<CarouselElement
							v-for="(src, slideIndex) of galleryContent"
							:key="`Thumb ${slideIndex}`"
							:gallery-count="galleryContent?.length"
							:slide-index="`${slideIndex}thumb`"
							:src="src"
							:class="{ 'active-thumb': slideIndex === activeIndex }"
							thumb
							@click="setActiveIndex(slideIndex)" />
					</div>

					<div v-if="galleryContent?.length > 1" class="game-gallery__nav">
						<BaseButton
							v-show="!mobile"
							class="game-gallery__nav-prev"
							icon="/icons/carousel-arrow.svg"
							link
							silent
							style="transform: scale(2)"
							@click="setSlide(activeIndex - 1)" />
						<BaseButton
							v-show="!mobile"
							style="transform: scale(2) rotate(180deg)"
							class="game-gallery__nav-next"
							icon="/icons/carousel-arrow.svg"
							link
							silent
							@click="setSlide(activeIndex + 1)" />
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script>
import BaseButton from '~/components/base/base-button.vue';
import CarouselElement from '~/components/game/carousel-element.vue';

export default {
	name: 'GameCarousel',
	components: { BaseButton, CarouselElement },
	props: {
		gallery: Object,
	},
	data() {
		return {
			activeIndex: 0,
			galleryType: 'videos',
			fullScreenCarousel: false,
		};
	},
	computed: {
		screenshotsButtonVariant() {
			return this.galleryType === 'videos' ? 'outline' : 'active-toggle';
		},
		videosButtonVariant() {
			return this.galleryType === 'videos' ? 'active-toggle' : 'outline';
		},
		videos() {
			return this.galleryType === 'videos';
		},
		galleryContent() {
			return this.gallery[this.galleryType].map((slide) => slide.src);
		},
	},
	mounted() {
		if (this.gallery?.showScreenshots) {
			this.setGallery('screenShots');
		} else if (this.gallery?.showVideos) {
			this.setGallery('videos');
		}
	},
	methods: {
		setGallery(value) {
			this.galleryType = value;
		},

		setActiveIndex(index) {
			const carousel = this.$refs.carousel;
			const thumbnails = this.$refs.thumbnails;
			const slide = document.getElementById(`slide${index}`);
			const thumb = document.getElementById(`slide${index}thumb`);
			this.activeIndex = index;

			if (carousel && thumbnails && slide) {
				setTimeout(() => {
					carousel.scrollLeft =
						slide.offsetLeft - carousel.offsetWidth / 2 + slide.clientWidth / 2;
					thumbnails.scrollLeft =
						thumb.offsetLeft - thumbnails.offsetWidth / 2 + thumb.clientWidth / 2;
				}, 200);
			}
		},

		setSlide(index) {
			const computedIndex = (index + this.galleryContent.length) % this.galleryContent.length;
			this.setActiveIndex(computedIndex);
		},
	},
};
</script>

<style lang="scss" scoped>
.overlay {
	position: absolute;
	width: 100%;
	height: 100%;
}

.game-gallery {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	z-index: 1;
	margin-bottom: 130px;

	&.fullscreen-carousel {
		bottom: 0;
		left: 0;
		position: fixed;
		right: 0;
		top: 0;
		z-index: 9999999 !important;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;

		.game-gallery__inner::after,
		.game-gallery__inner::before {
			content: none;
		}
	}

	@media (min-width: 0px) {
		overflow: hidden;
		z-index: 1;
		margin-bottom: 10vw;
	}

	@media (min-width: 769px) {
		margin-bottom: 2.5vw;
	}

	@media (min-width: 1100px) {
		margin-bottom: 5vw;
	}
}

.game-gallery__outer {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.game-gallery__inner {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	&:before,
	&:after {
		pointer-events: none;

		content: '';
		position: absolute;
		top: 0;
		min-width: 100px;
		max-width: 620px;
		width: calc((100vw / 2) / 3);
		z-index: 1;

		height: 100%;
	}

	&:before {
		left: 0;
		background: linear-gradient(90deg, #0d143a 0%, rgba(18, 15, 44, 0) 100%);
	}

	&:after {
		right: 0;
		background: linear-gradient(270deg, #0f1336 0%, rgba(18, 15, 44, 0) 100%);
	}
}

.game-gallery__tabs {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;

	.button {
		&.dark {
		}
	}

	@media (min-width: 0px) {
		margin-bottom: 7.5vw;
	}

	@media (min-width: 769px) {
		margin-bottom: 4vw;
	}

	@media (min-width: 1100px) {
		margin-bottom: 3vw;
	}
}

.game-gallery__nav {
	position: absolute;
	width: 100%;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	padding: 0 20px;
	top: 0;
	pointer-events: none;

	@media (min-width: 480px) {
		height: 267px;
	}

	@media (min-width: 769px) {
		height: 360px;
	}

	@media (min-width: 1024px) {
		height: 500px;
	}

	@media (min-width: 1921px) {
		height: 720px;
	}
}

.none {
	background: none;
}

::-webkit-scrollbar {
	width: 0;
	height: 0;
}

.gradient {
	background: var(--dark-gradient);
}

.fullscreen-carousel {
	.game-gallery__nav {
		pointer-events: auto;
		height: calc(100% - 200px);
	}

	.carousel--thumb {
		height: 200px;

		.carousel__item {
			@media (min-width: 0px) {
				width: 157px !important;
				height: 95px;
			}

			@media (min-width: 480px) {
				width: 220px !important;
				height: 135px;
			}
		}

		.carousel__item-image {
			background-size: cover;
			border-radius: 15px;

			@media (min-width: 0px) {
				width: 147px;
				height: 84px;
				overflow: hidden;
			}

			@media (min-width: 480px) {
				width: 215px !important;
				height: 110px;
				overflow: hidden;
			}

			img {
				object-fit: cover;
			}
		}
	}
}

.fullscreen-carousel__bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100%;
	width: 100%;
	background: rgba(18, 15, 44, 0.95);
}

.fullscreen-carousel__close {
	position: absolute;
	top: 30px;
	right: 30px;
	z-index: 20;
	width: 30px;
	height: 30px;

	img {
		width: 100%;
		height: auto;
	}
}

.carousel__item {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	border-radius: 15px;
	cursor: pointer;
}

.carousel {
	display: flex;
	overflow-x: auto;
	scroll-behavior: smooth;
	overscroll-behavior-x: none;

	&--main {
		position: relative;
		align-items: center;
		width: 100%;
		height: 100%;

		@media (min-width: 0px) {
			gap: 0.1vw;
			padding-left: 0.1vw;
			padding-right: 0.1vw;
		}

		@media (min-width: 769px) {
			gap: 3vw;
			margin-bottom: 2vw;
		}

		@media (min-width: 1024px) {
			gap: 1.5vw;
			padding-left: 1.25vw;
			padding-right: 1.25vw;
		}

		.carousel__item {
		}

		.carousel__item-image {
			width: 890px;
			height: 500px;
		}
	}

	&--full {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: calc(100% - 200px);
	}

	&--thumb {
		position: relative;
		align-items: center;
		width: 100%;
		height: 100%;
		gap: 2.5vw;
		flex-direction: row;
		padding: 0.5vw 1.25vw 2.5vw;

		@media (min-width: 769px) {
			gap: 1.5vw;
			padding-left: 2.5vw;
			padding-right: 2.5vw;
		}

		@media (min-width: 1100px) {
			gap: 1vw;
		}

		.carousel__item {
			padding: 5px;
			border-radius: 15px;
		}
	}
}
</style>
