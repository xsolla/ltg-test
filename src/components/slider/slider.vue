<template>
	<div v-if="sliders[0]" class="w-ab-100 mb-0-S mb-0">
		<div
			class="h-ab-100 fd-c ai-c slider-wrapper h-px-60-L h-px-52-M h-px-42-S h-px-61-XM h-px-56">
			<SliderCell
				v-for="(slider, index) of sliders"
				:key="`${slider.sort} Slider`"
				:active="activePoint === index"
				class="slider-item t-0"
				:slider="slider" />
		</div>

		<div class="w-ab-100 p-a b-0 px-ab-6 fd-c-S fd-cr ai-c jc-c z-1 hiddenOnMobile">
			<div class="w-ab-100 fd-r">
				<div class="slider__nav-points w-ab-100 fd-r ai-c ai-b-XL jc-c-S jc-t">
					<Point
						v-for="(slide, index) of sliders"
						:id="index"
						:key="`${index} Point`"
						:active="activePoint === index"
						@setNextSlider="setNextSlider()"
						@click="setActive(index)" />

					<div
						style="transform: scale(1.8) translateX(1rem)"
						class="w-1 cr-p hiddenOnMobile"
						@click="setNextSlider">
						<img
							class="w-ab-100-S w-ab-80-L w-ab-60-XL"
							src="/icons/arrow-right-white.svg"
							alt="arrow" />
					</div>
				</div>

				<div class="w-ab-9 visibleOnMobile" @click="setNextSlider">
					<img
						class="w-ab-100-S w-ab-80-L w-ab-60-XL"
						src="/icons/arrow-right-white.svg"
						alt="arrow" />
				</div>
			</div>
		</div>
		<div class="w-ab-100 px-ab-6 fd-c-S fd-cr ai-c jc-c z-1 visibleOnMobile">
			<div class="fd-r">
				<div class="slider__nav-points w-ab-100 fd-r ai-c ai-b-XL jc-c-S jc-t">
					<Point
						v-for="(slide, index) of sliders"
						:id="index"
						:key="`${index} Point`"
						:active="activePoint === index"
						@setNextSlider="setNextSlider()"
						@click="setActive(index)" />

					<div
						style="transform: scale(1.8) translateX(1rem)"
						class="w-1 cr-p hiddenOnMobile"
						@click="setNextSlider">
						<img
							class="w-ab-100-S w-ab-80-L w-ab-60-XL"
							src="/icons/arrow-right-white.svg"
							alt="arrow" />
					</div>
				</div>

				<div class="w-ab-9 visibleOnMobile" @click="setNextSlider">
					<img
						class="w-ab-100-S w-ab-80-L w-ab-60-XL"
						src="/icons/arrow-right-white.svg"
						alt="arrow" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SliderCell from '~/components/slider/slider-cell.vue';
import Point from '@/components/slider/slider-button.vue';

export default {
	name: 'Slider',
	components: { Point, SliderCell },
	props: {
		sliders: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			activePoint: 0,
			timer: 0,
		};
	},
	methods: {
		setActive(id) {
			this.activePoint = id;
		},
		setNextSlider() {
			this.activePoint++;
			if (this.activePoint > this.sliders.length - 1) {
				this.setActive(0);
			}
			this.setActive(this.activePoint);
		},
	},
};


</script>

<style lang="scss" scoped>
.slider {
	height: 60rem;

	@media (max-width: 1100px) {
		height: 70rem;
	}
	@media (max-width: 768px) {
		height: 90rem;
	}
}
.slider__nav-points {
	@media (max-width: 768px) {
		margin-top: -20px;
	}
}
.slider__nav-points-item {
	margin: 0 20px;
}

.hiddenOnMobile {
	@media (max-width: 768px) {
		display: none;
	}
}

.visibleOnMobile {
	@media (min-width: 768px) {
		display: none;
	}
}
</style>
