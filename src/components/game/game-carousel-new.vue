<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";
import LButton from '~/components/base/v2/l-button.vue';

const props = defineProps({
	gallery: Object, // Принимаем `gallery` из `game.gallery`
})
const galleryType = ref("screenShots"); // По умолчанию показываем скриншоты

const setGallery = (value) => {
	galleryType.value = value;
};

const thumbsSwiper = ref(null);
const isModalOpen = ref(false);
const selectedIndex = ref(0);

const openModal = (index) => {
	selectedIndex.value = index;
	isModalOpen.value = true;
	document.body.classList.add('lock');
};

const closeModal = () => {
	isModalOpen.value = false;
	document.body.classList.remove('lock');
};
</script>

<template>

	<div class="game-gallery">

		<div class="game-gallery__tabs">
			<LButton
				v-if="gallery.showScreenshots && gallery.showVideos"
				@click="setGallery('screenShots')"
			>
				{{ $t('game.screenshots') }}
			</LButton>
			<LButton
				v-if="gallery.showVideos"
				@click="setGallery('videos')"
			>
				{{ $t('game.videos') }}
			</LButton>
		</div>

		<!-- Главный слайдер -->
		<div class="gallery-container">
			<Swiper
				:modules="[Navigation, Thumbs]"
				:slides-per-view="1.7"
				:space-between="10"
				:centered-slides="true"
				:speed="700"
				navigation
				:thumbs="{ swiper: thumbsSwiper }"
				class="main-swiper"
				:breakpoints="{
				768: { slidesPerView: 1.7 },
				1024: { slidesPerView: 2 },
		  	}"
			>
				<SwiperSlide v-for="(image, index) in gallery.screenShots" :key="index">
					<div class="slide-content" :class="{ active: index === selectedIndex }" @click="openModal(index)">
						<img :src="image.src" :alt="image.alt" class="main-image" />
					</div>
				</SwiperSlide>
			</Swiper>

			<!-- Превью слайдер -->
			<Swiper
				@swiper="(swiper) => (thumbsSwiper = swiper)"
				:modules="[Navigation, Thumbs]"
				:slides-per-view="'auto'"
				:space-between="10"
				watch-slides-progress
				class="thumbs-swiper"
			>
				<SwiperSlide v-for="(image, index) in gallery.screenShots" :key="'thumb-' + index" class="thumb-slide">
					<img :src="image.src" :alt="image.alt" class="thumb-image" />
				</SwiperSlide>
			</Swiper>

		</div>

	</div>

	<!-- Модальное окно -->
	<div v-if="isModalOpen" class="gallery-modal-overlay" @click.self="closeModal">
		<div class="modal-content">
			<button class="close-button" @click="closeModal">
				<IconUiKitClose/>
			</button>
			<Swiper
				:modules="[Navigation]"
				:slides-per-view="1"
				:initial-slide="selectedIndex"
				navigation
				:speed="700"
				class="modal-swiper"
			>
				<SwiperSlide v-for="(image, index) in images" :key="'modal-' + index">
					<img :src="image.src" :alt="image.alt" class="full-image" />
				</SwiperSlide>
			</Swiper>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.game-gallery {
	margin: 70px 0 100px;
}

.game-gallery__tabs {
	display: flex;
	gap: 20px;
	justify-content: center;

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

::v-deep(.swiper-button-prev),
::v-deep(.swiper-button-next) {
	z-index: 900;
	color: rgba(255,255,255,0.6);
	transition: color cubic-bezier(0.65, 0, 0.35, 1) 0.3s;
}

::v-deep(.swiper-button-next:hover),
::v-deep(.swiper-button-prev:hover) {
	color: rgba(253, 250, 143, 1);
}

::v-deep(.swiper-button-next),
::v-deep(.swiper-rtl .swiper-button-prev) {
	right: 30px;
	left: unset;
}

::v-deep(.swiper-button-prev),
::v-deep(.swiper-rtl .swiper-button-next) {
	left: 30px;
	right: unset;
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
	justify-content: center;

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
	width: 205px !important;
	height: 115px !important;
	display: flex;
	align-items: center;
	justify-content: center;
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
	z-index: 4000;
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
		top: 0px;
		right: 40px;
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


@media (max-width: 768px) {
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

	.close-button {
		top: -20px;
	}
}

</style>
