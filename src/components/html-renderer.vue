<script>
import { compile } from 'vue';
import CompareSlider from './slider/slider-compare.vue';
import { ImgComparisonSlider } from '@img-comparison-slider/vue';

export default {
	components: { CompareSlider, ImgComparisonSlider },
	props: {
		html: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		return compile(props.html);
	},
};
</script>
