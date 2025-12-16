<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";

const props = defineProps({
	gallery: Object,
});

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
	<div class="gallery-container gallery-container--screens">

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
				<div class="slide-content" @click="openModal(index)">
					<img :src="image.src" alt="gallery image" class="main-image" />
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
				<img :src="image.src" alt="gallery image" class="thumb-image" />
			</SwiperSlide>
		</Swiper>
	</div>

	<!-- Модальное окно -->
	<div v-if="isModalOpen" class="gallery-modal-overlay" @click.self="closeModal">
		<div class="modal-content">
			<button class="close-button" @click="closeModal">
				&times;
			</button>
			<Swiper
				:modules="[Navigation]"
				:slides-per-view="1"
				:initial-slide="selectedIndex"
				navigation
				:speed="700"
				class="modal-swiper"
			>
				<SwiperSlide v-for="(image, index) in gallery.screenShots" :key="'modal-' + index">
					<img :src="image.src" alt="gallery image" class="full-image" />
				</SwiperSlide>
			</Swiper>
		</div>
	</div>
</template>
<style scoped lang="scss">

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
</style>


