<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';
const { mobile, tablet } = useMobileTablet();

const props = defineProps({
	active: Boolean,

	src: {
		type: String,
		default: '/arts/slide1.png',
	},

	slideIndex: {
		type: [String, Number],
		default: undefined,
	},

	thumb: Boolean,

	fullscreen: Boolean,

	galleryCount: {
		type: Number,
		default: 0,
	},
});

const video = computed(() => props.src.includes('youtube'));

const fullscreenEnabled = useState('fullscreen-enabled');

const loaded = ref(false);
const stop = ref(false);

watch(
	() => props.active,
	() => {
		if (props.video && !props.active) {
			loaded.value = false;
			stop.value = true;
			setTimeout(() => {
				stop.value = false;
			}, 50);
			setTimeout(() => {
				loaded.value = true;
			}, 300);
		}
	}
);

function setActive() {
	if (props.active && !props.video && !mobile.value && !tablet.value) {
		fullscreenEnabled.value = !fullscreenEnabled.value;
	}
}

const itemClass = computed(() => {
	if (props.fullscreen) {
		return 'carousel__item-unique';
	}
	if (!props.galleryCount || props.galleryCount === 1) {
		return 'carousel__item-unique';
	}
	if (props.slideIndex === 0) {
		return 'carousel__item-left';
	}
	if (props.slideIndex === props.galleryCount - 1) {
		return 'carousel__item-right';
	}
	return 'carousel__item-unique';
});
</script>
<template>
	<div
		v-show="fullscreen ? active : true"
		:id="`slide${slideIndex}`"
		:style="
			active
				? fullscreenEnabled
					? 'cursor: zoom-out'
					: 'cursor: zoom-in'
				: 'cursor: pointer'
		"
		class="carousel__item"
		:class="itemClass"
		@click="setActive">
		<figure
			v-if="!video"
			class="image carousel__item-image"
			:class="`${active ? 'active' : ''}`"
			:style="`background-image: url('${src}')`"></figure>

		<div
			v-if="video"
			class="carousel__video-item video video-custom"
			:class="`${active ? 'active' : 'bar'} ${thumb ? 'foo2' : 'foo'}`">
			<iframe
				v-if="!thumb"
				id="iframe"
				class="carousel__video-frame carousel__video-frame--main image"
				:src="`${src}?controls=0`"
				allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
				allowfullscreen />

			<iframe
				v-if="!stop"
				:class="loaded ? 'o-10' : 'o-0'"
				class="carousel__video-frame carousel__video-frame--main image"
				:src="`${src}?controls=0`"
				allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
				allowfullscreen
				@load="loaded = true" />

			<div
				v-if="!active || thumb"
				class="w-ab-100 h-ab-100 p-a t-0 l-0 overlay-not-active"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.carousel__video-frame {
	&--main {
		@media (min-width: 0px) {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			border-radius: 3vw;
			border-width: 0;
		}

		@media (min-width: 769px) {
			border-radius: 0.6vw;
		}
	}

	&--thumb {
		@media (min-width: 0px) {
			height: 100%;
			width: 100%;
			opacity: 1;
			border-width: 0;
		}
	}
}

.carousel__item-left {
	margin-left: 10vw;
}

.carousel__item-right {
	margin-right: 10vw;
}

.carousel--main {
	.carousel__item-image,
	.carousel__video-item {
		background-size: cover;
		background-repeat: no-repeat;
		overflow: hidden;
		transform: scale(0.95);
		transition: transform 0.4s linear 0.3s;

		@media (min-width: 0) {
			width: 320px;
			height: 180px;
		}

		@media (min-width: 480px) {
			width: 475px;
			height: 267px;
		}

		@media (min-width: 769px) {
			width: 640px;
			height: 360px;
		}

		@media (min-width: 1024px) {
			width: 890px;
			height: 500px;
		}

		@media (min-width: 1921px) {
			width: 1280px;
			height: 720px;
		}

		&.active {
			transform: scale(1);
		}
	}

	.carousel__item-left {
		@media (min-width: 0) {
			margin-left: 10%;
		}
		@media (min-width: 480px) {
			margin-left: 25%;
		}
	}

	.carousel__item-unique {
		margin-right: auto;
		margin-left: auto;
	}
}

.carousel--full {
	.carousel__item-image {
		background-size: cover;
		border-radius: 15px;
		overflow: hidden;

		@media (min-width: 0) {
			width: 320px;
			height: 180px;
		}

		@media (min-width: 480px) {
			width: 475px;
			height: 267px;
		}

		@media (min-width: 769px) {
			width: 640px;
			height: 360px;
		}

		@media (min-width: 1024px) {
			width: 854px;
			height: 490px;
		}

		@media (min-width: 1400px) {
			width: 1280px;
			height: 720px;
		}

		@media (min-width: 1800px) {
			width: 1536px;
			height: 864px;
		}
	}
}

.carousel--thumb {
	.carousel__item-image,
	.carousel__video-item {
		background-size: cover;

		@media (min-width: 0px) {
			width: 147px;
			height: 84px;
			overflow: hidden;
		}

		@media (min-width: 480px) {
			width: 220px !important;
			height: 125px;
			overflow: hidden;
		}

		img {
			object-fit: cover;
		}
	}
}
</style>
