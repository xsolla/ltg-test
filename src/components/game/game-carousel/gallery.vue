<script setup>
import LButton from '~/components/base/v2/l-button.vue';
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs} from "swiper/modules";

const props = defineProps({
	gallery: Object,
});

const galleryType = ref("screenShots");

const setGallery = (value) => {
	galleryType.value = value;
};

// Динамическое подключение компонентов
const currentGalleryComponent = computed(() => {
	return galleryType.value === "screenShots"
		? defineAsyncComponent(() => import("./screenshotsGallery.vue"))
		: defineAsyncComponent(() => import("./videosGallery.vue"));
});


const selectedIndex = ref(0);
const swiperInstance = ref(null);

// Получаем текущий массив (изображения или видео)
const currentItems = computed(() => {
	return galleryType.value === "screenShots" ? props.gallery.screenShots : props.gallery.videos;
});

// Запоминаем Swiper-инстанс
const isSwiperReady = ref(false);

const setSwiperInstance = (swiper) => {
	swiperInstance.value = swiper;
	isSwiperReady.value = true;

	// Принудительное обновление Swiper
	setTimeout(() => {
		if (swiperInstance.value) swiperInstance.value.update();
	}, 50);
};

const prevSlide = () => {
	if (swiperInstance.value) swiperInstance.value.slidePrev();
};
const nextSlide = () => {
	if (swiperInstance.value) swiperInstance.value.slideNext();
};
</script>
<template>
	<div class="game-gallery">

		<div v-if="gallery.showScreenshots && gallery.showVideos" class="game-gallery__tabs">
			<LButton
				@click="setGallery('screenShots')"
				:class="{ active: galleryType === 'screenShots' }"
			>
				{{ $t('game.screenshots') }}
			</LButton>
			<LButton
				@click="setGallery('videos')"
				:class="{ active: galleryType === 'videos' }"
			>
				{{ $t('game.videos') }}
			</LButton>
		</div>

		<!-- Динамическая загрузка контента -->
		<keep-alive>
			<component :is="currentGalleryComponent" :gallery="gallery"></component>
		</keep-alive>


	</div>
</template>
<style lang="scss">
.swiper-slide {
	cursor: pointer!important;
}

.game-gallery {
	margin: 0 0 100px;
}

.game-gallery__tabs {
	display: flex;
	gap: 20px;
	justify-content: center;
	padding-top: 70px;

	button {
		border: 2px solid #B1B9E7;/* Button */
		font-style: normal;
		font-weight: 700;
		font-size: 16px;
		line-height: 21px;
		color: #B1B9E7;

		&.active {
			background: #242C57;
			border: 2px solid #7F8BC9;
		}

		&:hover {
			border-color: #ffffff;
			color: #ffffff;
		}
	}
}

.gallery-container {
	position: relative;
	margin: 0 auto 70px;
}

.main-swiper {
	position: relative;
	overflow: hidden;
	padding: 30px 0;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		z-index: 899;
		height: 100%;
		width: clamp(55px, 8%, 150px);
		background: linear-gradient(90deg, #0D143A 0%, rgba(18, 15, 44, 0) 100%);
	}

	&:after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		z-index: 899;
		height: 100%;
		width: clamp(55px, 8%, 150px);
		background: linear-gradient(-90deg, #0D143A 0%, rgba(18, 15, 44, 0) 100%);
	}
}

.slide-content {
	transition: transform 0.3s ease, opacity 0.3s ease;
	text-align: center;
	cursor: pointer;
}

.swiper-slide .slide-content img {
	transform: scale(0.93);
	transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.swiper-slide-active .slide-content img {
	transform: scale(1);
}

.main-image {
	width: 100%;
	height: auto;
}

.thumbs-swiper {
	position: relative;
	display: flex;
	margin-top: 20px;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		z-index: 899;
		height: 100%;
		width: clamp(101px, 8%, 150px);
		background: linear-gradient(90deg, #0D143A 0%, rgba(18, 15, 44, 0) 100%);
	}

	&:after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		z-index: 899;
		height: 100%;
		width: clamp(101px, 8%, 150px);
		background: linear-gradient(-90deg, #0D143A 0%, rgba(18, 15, 44, 0) 100%);
	}
}

.thumb-wrapper {
	width: 205px;
	height: 115px;
	display: flex;
	align-items: center;
}

.thumb-slide {
	position: relative;
	width: 205px !important;
	height: 115px !important;
	display: flex;
	align-items: center;
	justify-content: center;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 100;
		width: 100%;
		height: 100%;
		background-color: rgba(138, 146, 236, 0.2);
		opacity: 1;
		transition: opacity 0.3s cubic-bezier(0.65, 0, 0.35, 1);
	}

	&:hover:before {
		opacity: 0;
	}

	&:after {
		content: '';
	}

}

.thumb-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	cursor: pointer;
	transition: transform 0.2s;
}

.swiper-slide-thumb-active {
	position: relative;
	z-index: 20;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 21;
		width: 100%;
		height: 100%;
		border: 4px solid #FDFA8F;
	}
}

/* Модальное окно */
.gallery-modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9998;
	width: 100%;
	height: 100%;
	background: rgb(13, 20, 58, 0.95);
	display: flex;
	align-items: center;
	justify-content: center;

	::v-deep(.swiper-button-prev),
	::v-deep(.swiper-button-next) {
		z-index: 900;
		color: #ffffff;
	}
}

.modal-content {
	position: relative;
	max-width: 95%;
	max-height: 95%;
	padding: 10px;

	.close-button {
		top: -10px;
		right: -10px;
	}
}

.full-image {
	width: 100%;
	max-height: 90vh;
	object-fit: contain;
}

.close-button {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 1000;
	border: none;
	background: none;
	font-size: 24px;
	color: white;
	cursor: pointer;
}

/* Кастомные кнопки навигации */
.custom-prev,
.custom-next {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: red;
	color: white;
	border: none;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 24px;
	z-index: 10;
}

.custom-prev {
	left: -50px;
}

.custom-next {
	right: -50px;
}

.custom-prev:hover,
.custom-next:hover {
	background: rgba(0, 0, 0, 0.9);
}

.video-frame {
	border: 0;
}


@media (max-width: 768px) {
	.main-swiper {
		padding: 30px 0 15px;
	}

	.thumb-slide {
		width: 105px !important;
		height: 70px !important;
	}

	::v-deep(.swiper-button-next),
	::v-deep(.swiper-button-prev) {
		font-size: 24px;
	}

	::v-deep(.swiper-button-next) {
		right: 10px;
	}

	::v-deep(.swiper-button-prev) {
		left: 10px;
	}

	.modal-content {
		max-width: 100%;
		max-height: 100%;
	}

	.modal-content .close-button {
		top: -20px;
		right: 10px;
	}

	.swiper-button-prev:after, .swiper-button-next:after {
		font-size: 24px;
	}

	.swiper-button-next, .swiper-rtl .swiper-button-prev {
		right: 15px;
	}

	.swiper-button-prev, .swiper-rtl .swiper-button-next {
		left: 15px;
	}
}

</style>
