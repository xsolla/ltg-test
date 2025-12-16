<template>
	<div class="layout-features-shadow">
		<div id="media">
			<div class="features-title__wrapper">
				<div class="features__wrapper">
					<div class="section-thumb">
						<div class="thumbs-wrapper">
							<Swiper
								:modules="modules"
								@swiper="setFirstSwiper"
								:controller="{ control: secondSwiper }"
								class="mySwiperThumbs"
								:slideToClickedSlide="true"
								:slidesPerView="5"
								:centeredSlides="true"
								ref="thumbSwiper"
								:breakpoints="{
																'320': {
																		slidesPerView: 2,
																		spaceBetween: 10,
																},
																'600': {
																		slidesPerView: 3,
																		spaceBetween: 20,
																},
																'1024': {
																		slidesPerView: 5,
																		spaceBetween: 20,
																},
														}">
								<SwiperSlide v-for="(slide, index) in slides" :key="index" class="slide-thumbs">
									{{ slide.thumb }}
								</SwiperSlide>
							</Swiper>
						</div>
					</div>
				</div>
			</div>
		<div class="section-slides">
			<Swiper
				:modules="modules"
				@swiper="setSecondSwiper"
				:controller="{ control: firstSwiper }"
				:effect="'fade'"
				:slidesPerView="1"
				:centeredSlides="true"
				:navigation="{ nextEl: '.features--arden .carousel__arrows-next', prevEl: '.features--arden .carousel__arrows-prev' }"
				:autoplay="{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }"
				ref="mainSwiper">
				<SwiperSlide v-for="(slide, index) in slides" :key="index">
					<div class="feature-bg" :key="index" ></div>
					<div class="carousel__item">
						<div class="slide__col slide__col--image">
							<div class="mask-wrapper">
								<div class="video">
									<video ref="gifVideo" autoplay loop muted playsinline>
										<source :src="`https://cdn.ltg.com/lif/images/features/gifs/${slide.mp4}`" type="video/mp4" />
										<source :src="`https://cdn.ltg.com/lif/images/features/gifs/${slide.gif}`" type="video/webm" />
										Your browser doesn't support HTML5 video tag.
									</video>
								</div>
								<div class="mask">
									<LifVideoMask />
								</div>
							</div>
						</div>
						<div class="slide__col slide__col--content">
							<h2 class="content-title">
								{{ slide.title }}
							</h2>
							<p>
								{{ slide.text }}
							</p>
						</div>
						<div class="carousel__arrows carousel__arrows--mobile">
							<button class="carousel__arrows-prev" @click="mainSwiper.slidePrev()">
								<IconArdenArrowSlider />
							</button>
							<button class="carousel__arrows-next" @click="mainSwiper.slideNext()">
								<IconArdenArrowSlider />
							</button>
						</div>
					</div>
				</SwiperSlide>
				<div class="carousel__arrows">
					<button class="carousel__arrows-prev">
						<IconArdenArrowSlider />
					</button>
					<button class="carousel__arrows-next">
						<IconArdenArrowSlider />
					</button>
				</div>
			</Swiper>
		</div>
		</div>
	</div>
</template>
<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectFade, Navigation, Thumbs, Controller, Autoplay } from "swiper/modules";

import "swiper/css";

import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import IconArdenArrowSlider from "~/components/game/arden/arden-arrow-slider.vue";
import LifVideoMask from '@/components/lif-video-mask.vue';
const { $i18n } = useNuxtApp();

const slides = computed(() => {
	const locale = $i18n.locale.value;
	return [
		{
			gif: "ARDEN_GIF_NEWMAP.webm",
			mp4: "ARDEN_GIF_NEWMAP.mp4",
			bgImage: "",
			thumb: $i18n.t("arden-index.slides.slide1.thumb"),
			title: $i18n.t("arden-index.slides.slide1.title"),
			text: $i18n.t("arden-index.slides.slide1.text"),
		},
		{
			gif: "ARDEN_GIF_CRAFT.webm",
			mp4: "ARDEN_GIF_CRAFT.mp4",
			bgImage: "",
			thumb: $i18n.t("arden-index.slides.slide2.thumb"),
			title: $i18n.t("arden-index.slides.slide2.title"),
			text: $i18n.t("arden-index.slides.slide2.text"),
		},
		{
			gif: "ARDEN_GIF_OBJECTS.webm",
			mp4: "ARDEN_GIF_OBJECTS.mp4",
			bgImage: "",
			thumb: $i18n.t("arden-index.slides.slide3.thumb"),
			title: $i18n.t("arden-index.slides.slide3.title"),
			text: $i18n.t("arden-index.slides.slide3.text"),
		},
		{
			gif: "Guild_Confrontations.webm",
			mp4: "Guild_Confrontations.mp4",
			bgImage: "",
			thumb: $i18n.t("arden-index.slides.slide4.thumb"),
			title: $i18n.t("arden-index.slides.slide4.title"),
			text: $i18n.t("arden-index.slides.slide4.text"),
		},
		{
			gif: "Advanced_Terraforming_Construction.webm",
			mp4: "Advanced_Terraforming_Construction.mp4",
			bgImage: "",
			thumb: $i18n.t("arden-index.slides.slide5.thumb"),
			title: $i18n.t("arden-index.slides.slide5.title"),
			text: $i18n.t("arden-index.slides.slide5.text"),
		}
	];
});

const firstSwiper = ref(null);
const secondSwiper = ref(null);
const thumbSwiper = ref(null); // Ссылка на Swiper с миниатюрами
const mainSwiper = ref(null); // Ссылка на основной Swiper
const modules = [Navigation, Thumbs, EffectFade, Controller, Autoplay];

const setFirstSwiper = (swiper) => {
	firstSwiper.value = swiper;
};
const setSecondSwiper = (swiper) => {
	secondSwiper.value = swiper;
};
</script>
<style scoped lang="scss">
#__metaframe{
  z-index: 910 !important;
}
.swiper {
	@media screen and (max-width: 768px) {
	  height: max-content;
	}
}
.layout-features-shadow {
  position: relative;
  z-index: 1;

  .carousel__item {
	z-index: 30;
  }
}
.features-title__wrapper {
  position: relative;
  width: 100%;
  &::before {
	//content: "";
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	z-index: 100;
	height: 100%;
	width: 25%;
	background: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0) 100%);
  }

  &::after {
	//content: "";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	height: 100%;
	width: 25%;
	background: linear-gradient(-90deg, #000 0%, rgba(0, 0, 0, 0) 100%);
  }
}
.features__wrapper {
  position: relative;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 20px;


}

.section-thumb {
  //-webkit-mask-image: linear-gradient(180deg, #000 100%, transparent 78%);
  //mask-image: linear-gradient(180deg, #000 100%, transparent 78%);
  //background: #000;
}

.section-slides {
  position: relative;

  .section-container {
	width: 100%;
	max-width: 1320px;
	margin: 0 auto;
  }

  &:before {
	//content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 200;
	width: 100%;
	height: 25%;
	background-image: linear-gradient(0deg, rgba(0, 0, 0, 0) 25%, #000 100%);
  }

  &:after {
	display: none;

	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 200;
	width: 100%;
	height: 20%;
	background-image: linear-gradient(0deg, #000 25%, rgba(0, 0, 0, 0) 100%);
  }
}

.feature-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  animation: animationShowingBg 0.5s;

  @media screen and (max-width: 768px) {
	height: max-content;
  }
}

@keyframes animationShowingBg {
  from {
	opacity: 0;
	transform: translateX(10rem);
  }
  to {
	opacity: 1;
	transform: translateX(0);
  }
}

.thumbs-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 148px;
  background-image: url("https://cdn.ltg.com/lif/images/features/features-divider.png"), url("https://cdn.ltg.com/lif/images/features/features-divider.png");
  background-repeat: no-repeat;
  background-position:
	top center,
	bottom center;
  background-size: 100%;

  .carousel__item {
	opacity: 1;
  }

  .swiper-slide {
	cursor: pointer;
	transition: transform linear 0.2s;
	transform: scale(0.9);

	&:hover {
	  transform: scale(1.05);
	}
  }

  @media screen and (max-width: 768px) {
	height: 121px;
	background-image: url("https://cdn.ltg.com/lif/images/arden/divider-mobile.png"), url("https://cdn.ltg.com/lif/images/arden/divider-mobile.png");
  }
}

.slide-thumbs {
  color: #fff;
  font-family: "Goudy Trajan", serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
}

.slide-thumbs__text {
  text-transform: uppercase;
}

.slide-thumbs__title {
  display: flex;
  align-items: center;
  min-height: min-content;
}

.slide-thumbs.swiper-slide-active {
  color: #db9909;
}

.carousel__arrows {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 1450px;
  height: 50px;
  margin-top: 50px;
  margin-bottom: 10px;
  color: #ffffff;
  font-family: "Goudy Trajan", serif;
  font-size: 38px;

  button {
	position: absolute;
	z-index: 2000;
  }

  @media screen and (max-width: 768px) {
	display: none;
  }
}

.carousel__arrows.carousel__arrows--mobile {
  display: none;
  position: static;
  top: unset;
  right: unset;
  bottom: unset;
  left: unset;
  transform: none;

  .carousel__arrows-next,
  .carousel__arrows-prev {
	position: static;
  }

  @media screen and (max-width: 768px) {
	display: flex;
  }
}

.carousel__arrows-next,
.carousel__arrows-prev {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 2000;

  svg {
	fill: #db9909;
	transition: fill linear 0.3s;
  }

  &:hover {
	svg {
	  opacity: 0.7;
	}
  }

  &.swiper-button-disabled {
	opacity: 0.3;
	cursor: auto;

	&:hover {
	  svg {
		fill: #fff;
	  }
	}
  }
}

.carousel__arrows-prev {
  position: absolute;
  top: 50%;
  left: -5px;

  @media screen and (min-width: 1340px) {
	left: 30px;
  }
}

.carousel__arrows-next {
  position: absolute;
  top: 50%;
  right: -5px;

  svg {
	transform: rotate(180deg);
  }

  @media screen and (min-width: 1340px) {
	right: 30px;
  }
}

.carousel__item {
  position: relative;
  z-index: 1000;
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 12vh 20px 10rem 20px;
  opacity: 0;
  transition: opacity linear 0.7s;

  &:after {
	display: none;
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	z-index: 0;
	background-color: rgba(0, 0, 0, 0.5);
	width: 100%;
	height: 100%;

	@media screen and (max-width: 768px) {
	  display: block;
	}
  }

  @media screen and (max-width: 1200px) {
	padding: 12vh 2vw 10rem 2vw;
  }
}

.swiper-slide.swiper-slide-active {
  .feature-bg {
	transform: translateX(0);
	opacity: 1;
  }

  .carousel__item {
	opacity: 1;
	z-index: 8000;
  }

  .slide__col--content {
	transform: translateX(0);
  }

  .slide__col--image {
	transform: translateX(0);
  }
}

.swiper-slide.swiper-slide-prev {
  .carousel__item {
	opacity: 0;
	transition: opacity linear 0.7s;
  }
}

.slider .section-container {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}

.slide__col {
  position: relative;
  z-index: 1001;

  &--image {
	width: 100%;
	max-width: 780px;
	max-height: 440px;
	filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.8));
	transform: translateX(10rem);
	transition-delay: 0.1s;
	transition-duration: 0.7s;
  }

  &--content {
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;
	padding-bottom: 90px;
	width: 100%;
	width: 32.333333%;
	transform: translateX(15rem);
	transition-delay: 0.1s;
	transition-duration: 0.7s;
	line-height: 1.5;

	@media screen and (max-width: 768px) {
	  padding-bottom: 0;
	}

	h2 {
	  position: relative;
	  z-index: 30;
	  margin: -6px 0 10px 0;
	  color: #ffffff;
	  font-family: "Goudy Trajan", serif;
	  font-size: 38px;
	  font-style: normal;
	  font-weight: 400;
	  line-height: normal;
	  text-align: left;
	}

	p {
	  position: relative;
	  z-index: 30;
	  margin: auto 0 0 0;
	  color: #ecdbce;
	  font-family: "Inter", sans-serif;
	  font-style: normal;
	  font-weight: 300;
	  font-size: 20px;
	  text-align: left;
		word-break: normal;
	}
  }
}

.video {
  width: 100%;
  height: 100%;
  -webkit-clip-path: url(#mask);
  clip-path: url(#mask);

  iframe,
  video {
	width: 100%;
  }
}

.mask {
  position: absolute;
  top: 0;
}

.mask-wrapper {
  aspect-ratio: 16/9;
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 768px) and (max-width: 1200px) {
  .slide__col--content,
  .slide__col--image {
	width: 50%;
  }
}

@media screen and (max-width: 1024px) {
  .carousel__item {
	padding-left: 20px;
	padding-right: 20px;
  }
}

@media screen and (max-width: 768px) {
  .section-slides:after {
	content: "";
	z-index: 3000;
	height: 13%;
	background-image: linear-gradient(0deg, #000 13%, rgba(0, 0, 0, 0) 100%);
  }

  .carousel__item {
	flex-direction: column;
	gap: 0;
	padding: 6vh 20px 27px;
  }

  .slide__col--content,
  .slide__col--image {
	width: 100%;
  }

  .slide__col--content h2 {
	margin-top: 0;
	font-size: 32px;
  }

  .slide__col--image {
	margin-bottom: 50px;
  }

  .slide-thumbs {
	font-size: 16px;
  }
  .slider-ru .slide-thumbs {
	font-size: 15px;
  }

  .features__wrapper::before {
	content: "";
	width: 10%;
	background: linear-gradient(90deg, #000 0%, rgba(0, 0, 0, 0) 100%);
  }

  .features__wrapper::after {
	content: "";
	width: 10%;
	background: linear-gradient(-90deg, #000 0%, rgba(0, 0, 0, 0) 100%);
  }

  .thumbs-wrapper[data-v-d0bdff7c] {
	height: 105px;
  }

  .thumbs-wrapper .swiper-slide:hover {
	transform: unset;
  }
}

@media screen and (max-width: 480px) {
  .slide-thumbs__text {
	width: 100%;
	margin: 0 auto;
	font-size: 16px;
	line-height: 20px;
  }
}

</style>
