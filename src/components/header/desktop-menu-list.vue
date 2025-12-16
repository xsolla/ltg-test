<script setup lang="ts">
import MenuElement from '~/components/menu-element.vue';
import type { MenuItem } from '~/types';
import { useWindowSize } from '@vueuse/core';

type Props = {
	elements: MenuItem[];
};

const props = defineProps<Props>();

const visibleElements = ref<MenuItem[]>(props.elements);
const hiddenElements = ref<MenuItem[]>(props.elements.slice(2));

const { width } = useWindowSize();

watch(width,(val)=>{
	if (val <= 1240){
		visibleElements.value = props.elements.slice(0,2);
	}
	else {
		visibleElements.value = props.elements;
	}
});

</script>

<template>
	<ul class="main-menu list-reset">
		<MenuElement
			v-for="(item, index) in visibleElements"
			:key="index"
			source="header"
			variant="header"
			:item="item" />
	</ul>
	<div class="more-menu" v-if="hiddenElements.length">
		<span>More</span>
		<div class="more-menu__wrapper">
			<ul class="more-menu__list list-reset">
				<MenuElement
					v-for="(item, index) in hiddenElements"
					:key="`more-${index}`"
					source="header"
					variant="header"
					:item="item"
				/>
			</ul>
		</div>
	</div>
</template>

<style scoped lang="scss">

.container {
	display: flex;
	align-items: center;
	gap: 30px;
	position: relative;
}

.more-menu {
	display: none;
	position: relative;
	margin-left: 30px;

	&:hover {
		.more-menu__wrapper {
			visibility: visible;
			opacity: 1;
			transform: translateY(0);
		}

		span {
			background: var(--accent-gradient);
			background-clip: text;
			color: transparent;
		}
	}

	.more-menu__list {
		display: flex;
	}

	span {
		font-family: "Pilat Wide", "Montserrat", sans-serif;
		text-transform: uppercase;
		font-weight: 400;
		font-size: 14px;
		line-height: 40px;
		cursor: pointer;
	}

	@media screen and (min-width: 769px) and (max-width: 1240px) {
		display: block;
	}
}

.more-menu__wrapper {
	position: absolute;
	left: -20px;
	top: calc(100% + 10px);
	visibility: hidden;
	opacity: 0;
	transform: translateY(-10px);
	transition:
		opacity ease 0.25s,
		visibility ease 0.25s,
		transform ease 0.25s;
	z-index: 10;
}

.more-menu__list {
	display: none;
	flex-direction: column;
	background: var(--reskin-senary-dark-color);

	 li {
		 padding: 4px 15px;
		 text-transform: unset;
 	}
}

.main-menu {
	display: flex;
	gap: 30px;
	margin-right: auto;

	@media screen and (max-width: 768px) {
		display: none;
	}
}
</style>
