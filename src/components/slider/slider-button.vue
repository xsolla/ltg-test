<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';

const { mobile, tablet } = useMobileTablet();
</script>
<template>
	<div class="fd-r ai-c jc-c mx-1-S mx-ab-2">
		<SliderCircle v-if="active" class="p-a" @setNextSlider="$emit('setNextSlider')" />
		<button
			class="rad-40 point slider-button"
			:class="{
				active: active,
			}" />
	</div>
</template>

<script>
import SliderCircle from '@/components/slider/slider-circle.vue';
export default {
	name: 'SliderButton',
	components: { SliderCircle },
	props: {
		active: Boolean,
		id: {
			type: Number,
			default: NaN,
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'assets/css/base';

.slider-button {
	width: 22px;
	height: 22px;
	background: var(--white);

	&.active {
		background: var(--reskin-secondary-dark-color);
	}

	@media screen and (max-width: $max-tablet) {
		width: 18px;
		height: 18px;
	}

	@media screen and (max-width: $max-mobile) {
		width: 16px;
		height: 16px;
		margin: 0;
	}

	@media screen and (max-width: $max-tablet) {
		margin: 15px 5px 0 !important;
	}
}
</style>
