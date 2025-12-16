<script setup lang="ts">
type Size = 24 | 56;

type Props = {
	size?: Size;
};

const props = withDefaults(defineProps<Props>(), {
	size: 24,
});
</script>

<template>
	<svg
		:class="$style.icon"
		:width="size"
		:height="size"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M11 8.28692C11 8.10932 11.0942 7.94504 11.2475 7.85536L17.2375 4.35083C18.9042 3.37576 21 4.57775 21 6.50866V9.26756C21.5978 9.61337 22 10.2597 22 11C22 11.7403 21.5978 12.3866 21 12.7324V15.4974C21 17.4291 18.9026 18.631 17.236 17.6543L11.2472 14.1446C11.0941 14.0549 11 13.8907 11 13.7133V8.28692ZM3 10.9998C3 9.34292 4.34315 7.99977 6 7.99977H8.5C8.77614 7.99977 9 8.22363 9 8.49977V13.4998C9 13.7759 8.77614 13.9998 8.5 13.9998H6C4.34315 13.9998 3 12.6566 3 10.9998ZM8.99976 18.3153V16.6667C8.99976 16.2985 8.70128 16 8.33309 16H6.0183C5.50093 16 5.12131 16.4862 5.24679 16.9881L5.68074 18.7239C5.86823 19.4739 6.54207 20 7.3151 20C8.24551 20 8.99976 19.2458 8.99976 18.3153Z"
			fill="#18171C" />
	</svg>
</template>

<script lang="ts">
export default {
	name: 'SpeakerIcon',
};
</script>

<style lang="scss" module>
@import 'assets/css/themes/current';

.icon > path {
	fill: var(--icon-primary-color);
}
</style>
