<script setup lang="ts">
import { ref } from 'vue';
import type { ProjectCategory } from '~/types';
import ExpandIcon from '@/components/icon/ui-kit/expand.vue';

interface Props {
	categories: ProjectCategory[];
	selectedCategory: ProjectCategory;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	select: [id: string];
}>();

const isExpanded = ref(false);

const onContainerMouseLeave = () => {
	isExpanded.value = false;
};

const onToggleVisibilityClick = () => {
	console.log(isExpanded.value);

	isExpanded.value = !isExpanded.value;
};

const onItemClick = (id: string) => {
	emit('select', id);

	isExpanded.value = false;
};
</script>

<template>
	<div @mouseleave="onContainerMouseLeave" :class="$style.container">
		<button @click="onToggleVisibilityClick" :class="$style['expand-container-button']">
			{{ selectedCategory.name }}
		</button>

		<ul
			:class="[
				$style['selectable-item-container'],
				{
					[$style.expanded]: isExpanded,
				},
			]">
			<li
				:class="[$style.item, $style.selectable]"
				v-for="item in categories"
				:key="item._id">
				<button @click="onItemClick(item._id)">{{ item.name }}</button>
			</li>
		</ul>

		<button :class="$style['expansion-button']" @click.prevent="onToggleVisibilityClick">
			<ExpandIcon />
		</button>
	</div>
</template>

<style lang="scss" module>
@import 'assets/css/themes/current';

.container {
	max-height: 38px;
	overflow: visible;
}

.expansion-button {
	position: absolute;
	width: 34px;
	height: 30px;
	margin: auto 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 1;
	display: flex;
	padding-left: 7px;
	align-items: center;
}

.expand-container-button {
	padding: 4px 34px 4px 12px;
	background: var(--icon-accent-color);
	width: 100%;
	transition: background-color var(--common-transition-duration-easing-function);

	&:hover {
		background: var(--icon-constrast-color);
	}
}

.selectable-item-container {
	margin-top: -38px;
	display: flex;
	flex-direction: column;
	background: var(--icon-constrast-color);
	padding: 4px 38px 4px 4px;
	transition:
		opacity var(--common-transition-duration-easing-function),
		background-color var(--common-transition-duration-easing-function);
	visibility: hidden;
	opacity: 0;
	gap: 4px;

	cursor: pointer;

	&.expanded {
		visibility: visible;
		opacity: 1;
		z-index: 1;
	}
}

.item.selectable {
	--first-gradient-color: var(--icon-constrast-color);
	--second-gradient-color: var(--icon-constrast-color);

	transition:
		--first-gradient-color var(--common-transition-duration-easing-function),
		--second-gradient-color var(--common-transition-duration-easing-function);
	background: linear-gradient(var(--first-gradient-color), var(--second-gradient-color));

	&:hover {
		--first-gradient-color: var(--reskin-hover-button-gradient-first-color);
		--second-gradient-color: var(--reskin-hover-button-gradient-second-color);
	}

	&:active {
		--first-gradient-color: var(--reskin-primary-neutral-color);
		--second-gradient-color: var(--reskin-primary-neutral-color);
	}

	& > button {
		padding: 0 8px;
	}
}

.expand-container-button,
.item,
.item > button {
	width: 100%;
	text-transform: uppercase;
	text-align: left;
	font-weight: 700;
	font-size: 16px;
	line-height: 30px;
	color: var(--text-primary-invariably);
}
</style>
