<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const props = defineProps({
	gallery: Object,
});

defineEmits(["open-modal"]);
</script>
<template>
	<div class="gallery-container gallery-container--video">
		<Swiper
			:modules="[Navigation]"
			:slides-per-view="1"
			:initial-slide="selectedIndex"
			:speed="700"
			@swiper="setSwiperInstance"
			class="main-swiper"
		>
			<SwiperSlide v-for="(video, index) in gallery.videos" :key="index">
				<div class="slide-content" @click="$emit('open-modal', index)">
					<iframe
						:src="video.src"
						allowfullscreen
						class="video-frame"
					></iframe>
				</div>
			</SwiperSlide>
		</Swiper>
	</div>
</template>
<style scoped lang="scss">
.gallery-container--video {
	iframe {
		height: 500px;
		width: 890px;
		border-radius: 15px;
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

@media screen and (max-width: 1024px) {
	.gallery-container--video iframe {
		width: 95%;
		height: 330px;
	}
}
</style>
