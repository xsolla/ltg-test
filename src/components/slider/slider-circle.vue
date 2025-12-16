<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';

const { mobile, tablet } = useMobileTablet();
</script>
<template>
	<div class="fd-r ai-c jc-c mx-ab-1">
		<svg :class="mobile || tablet ? 'mobile' : 'desktop'" class="p-a" width="120" height="120">
			<circle
				ref="circle"
				stroke="var(--reskin-secondary-dark-color)"
				stroke-width="12"
				fill="transparent"
				r="52"
				cx="60"
				cy="60" />
		</svg>
	</div>
</template>

<script>
export default {
	name: 'SliderCircle',
	data: () => ({
		radius: 0,
		timer: 0,
	}),
	computed: {
		circumference() {
			return Number(this.radius * 2 * Math.PI);
		},
	},
	watch: {
		timer() {
			this.setProgress(this.timer * 1.6);
		},
	},
	mounted() {
		const circle = this.$refs.circle;
		if (circle) {
			this.radius = circle.r.baseVal.value;

			circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
			circle.style.strokeDashoffset = `${this.circumference}`;
		}

		setInterval(() => {
			this.timer++;
			if (this.timer > 59) {
				this.timer = 0;
				this.$emit('setNextSlider');
			}
		}, 100);
	},
	methods: {
		setProgress(percent) {
			const circle = this.$refs.circle;
			if (circle) {
				circle.style.strokeDashoffset = `${
					this.circumference - (percent / 100) * this.circumference
				}`;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
svg {
	circle {
		// axis compensation
		transform: rotate(-90deg);
		transform-origin: 50% 50%;
	}
}
.mobile {
	transform: scale(0.25);
	margin-top: 15px;
}
.desktop {
	transform: scale(0.32);
}
</style>
