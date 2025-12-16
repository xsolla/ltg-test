<script setup lang="ts">
type Size = 16 | 20;

type Props = {
	size?: Size;
};

const props = withDefaults(defineProps<Props>(), {
	size: 16,
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
			d="M4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L12 10.5858L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.4142 12L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L12 13.4142L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L10.5858 12L4.29289 5.70711Z" />
	</svg>
</template>

<script lang="ts">
export default {
	name: 'RemoveIcon',
};
</script>

<style lang="scss" module>
@import 'assets/css/themes/current';

.icon > path {
	fill: var(--icon-secondary-alpha-color);
}
</style>
