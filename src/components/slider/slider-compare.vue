<template>
	<ImgComparisonSlider class="comparasion-slider" :style="cssVariables">
		<figure slot="first" class="before">
			<img width="100%" :src="srcfirst" />
			<figcaption v-if="captionfirst" :style="figcaptionStyle">
				{{ captionfirst }}
			</figcaption>
		</figure>
		<figure slot="second" class="after">
			<img width="100%" :src="srcsecond" />
			<figcaption v-if="captionsecond" :style="figcaptionStyle">
				{{ captionsecond }}
			</figcaption>
		</figure>
	</ImgComparisonSlider>
</template>
<style scoped>
.comparasion-slider:focus {
	outline: none;
}

.before,
.after {
	margin: 0;
}

.before figcaption {
	left: 12px;
}

.after figcaption {
	right: 12px;
}
</style>
<script>
import { ImgComparisonSlider } from '@img-comparison-slider/vue';

export default {
	name: 'compare-slider',
	components: {
		ImgComparisonSlider,
	},
	props: {
		dividercolor: {
			default: 'white',
		},
		dividerwidth: {
			default: '2px',
		},
		captionscolor: {
			default: 'black',
		},
		captionsbgcolor: {
			default: 'white',
		},
		captionsposition: {
			default: 'bottom',
		},
		srcfirst: {
			type: String,
			default: '',
		},
		srcsecond: {
			type: String,
			default: '',
		},
		captionfirst: {
			type: String,
			default: '',
		},
		captionsecond: {
			type: String,
			default: '',
		},
	},
	computed: {
		figcaptionStyle() {
			const styles = {
				background: this.captionsbgcolor,
				'border-radius': '4px',
				color: this.captionscolor,
				opacity: '0.8',
				padding: '12px',
				position: 'absolute',
				'line-height': '100%',
			};

			if (this.captionsposition === 'top') {
				styles.top = '0';
			} else if (this.captionsposition === 'middle') {
				styles.top = '50%';
				styles.transform = 'translateY(-50%)';
			} else {
				styles.bottom = '0';
				styles.transform = 'translateY(-50%)';
			}

			return styles;
		},

		cssVariables() {
			const cssVars = {
				'--divider-width': this.dividerwidth,
				'--divider-color': this.dividercolor,
				'--default-handle-opacity': '0',
			};
			if (!isNaN(this.dividerwidth)) {
				cssVars['--divider-width'] += 'px';
			}

			return cssVars;
		},
	},
};
</script>
