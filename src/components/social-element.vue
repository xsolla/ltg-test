<script setup lang="ts">
defineProps({
	item: Object,
});
</script>

<template>
	<li v-if="item && item.href">
		<a
			target="_blank"
			:href="item.href"
			v-click-metrika="{ name: 'xpp_main_social_click', ev: item?.name }">
			<img class="footer__social-icon" :src="`/socials/${item.name}.svg`" alt="socials" />
		</a>
	</li>
</template>
<style lang="scss" scoped>
li {
	img {
		transition: all 300ms ease-in-out;
	}
	&:hover {
		img {
			transform: scale(1.1);
			filter: brightness(1.1);
		}
	}
}
</style>
