<template>
	<div
		v-if="fullScreenCarousel"
		class="w-ab-100 h-ab-100 p-f t-0 l-0 fd-r ai-c jc-c z-20 fullscreen-carousel__wrapper">
		<div class="w-ab-100 h-ab-100 p-a bg" @click="setFullScreenCarousel(false)"></div>

		<div class="w-ab-100 fd-c ai-c jc-c wtf-wrapper">
			<div class="w-ab-58 p-1 rad-5">
				<CarouselEl
					v-for="{ id, src, active } of gallery"
					:key="`Slide ${id}`"
					:video="src.includes('.mp4')"
					full-screen
					:slide-id="id"
					:src="src"
					:active="active" />
			</div>
			<Carousel full-screen />
		</div>
	</div>
</template>

<script>
import CarouselEl from '@/components/Features/Carousel/CarouselEl';
import Carousel from '@/components/Features/Carousel/Carousel';

export default {
	name: 'FullScreenCarousel',
	components: { Carousel, CarouselEl },
	computed: {
		gallery() {
			return [];
		},
	},
	data() {
		return {
			fullScreenCarousel: false,
		};
	},
	mounted() {
		window.onkeydown = (e) => {
			if (e.key === 'Escape') {
				this.setFullScreenCarousel(false);
			}
		};
	},
	methods: {
		setFullScreenCarousel() {},
	},
};
</script>

<style lang="scss" scoped>
.bg {
	background: rgba(18, 15, 44, 0.9);
}
.bg-image {
	background: var(--card-gradient-y);
}
.gradient {
	background: var(--dark-gradient);
}
</style>
