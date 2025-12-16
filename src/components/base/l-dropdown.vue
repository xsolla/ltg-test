<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import type { DropdownMenuItem } from '~/types/components';

type ExpansionConditionVariant = 'on-click' | 'on-hover';

interface Props {
	menuItems: DropdownMenuItem[];
	expansionConditionVariant?: ExpansionConditionVariant;
	isExpanded: boolean;
}

type Emits = {
	(eventName: 'menu-item-click', itemValue: string): void;
	(eventName: 'toggle-expansion', isExpanded: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
	expansionConditionVariant: 'on-click',
});

const emit = defineEmits<Emits>();

const container = ref(null);

onClickOutside(container, () => {
	emit('toggle-expansion', false);
});

const onExpansionToggle = () => {
	if (props.expansionConditionVariant === 'on-click') {
		emit('toggle-expansion', !props.isExpanded);
	}
};

const onMouseLeave = () => {
	emit('toggle-expansion', false);
};

const onMouseEnter = () => {
	if (props.expansionConditionVariant === 'on-hover') {
		emit('toggle-expansion', true);
	}
};

const onMenuItemClick = (itemValue: string) => {
	emit('menu-item-click', itemValue);
};
</script>

<template>
	<div
		class="l-dropdown-container"
		ref="container"
		@mouseenter="onMouseEnter"
		@mouseleave="onMouseLeave">
		<button @click="onExpansionToggle" class="expansion-button">
			<slot name="expansion-button-content" />
		</button>

		<ul
			:class="[
				'menu-item-list',
				{
					'is-expanded': isExpanded,
				},
			]">
			<li
				class="menu-item"
				v-for="(menuItem, index) in menuItems"
				:key="index"
				:class="{'is-selected': menuItem.isSelected}">
				<NuxtLink
					v-if="menuItem.href"
					v-click-metrika="menuItem.metricsData"
					:href="menuItem.href">
					{{ menuItem.title }}
				</NuxtLink>

				<button
					v-else-if="menuItem.value"
					v-click-metrika="menuItem.metricsData"
					@click="onMenuItemClick(menuItem.value)">
					{{ menuItem.title }}
				</button>
			</li>
		</ul>
	</div>
</template>

<style scoped lang="scss">
.container {
	display: flex;
	width: fit-content;
	z-index: 1;
}

.expansion-button {
	display: flex;
	align-items: center;
}

.menu-item-list {
	background: var(--reskin-senary-dark-color);
	position: absolute;
	left: -20px;
	top: calc(100% + 10px);
	z-index: 9999;
	display: flex;
	flex-direction: column;
	padding: 0 0 20px;
	visibility: hidden;
	opacity: 0;
	transform: translateY(-10px);

	transition:
		opacity var(--common-transition-duration-easing-function),
		visibility var(--common-transition-duration-easing-function),
		transform var(--common-transition-duration-easing-function);

	&.is-expanded {
		visibility: visible;
		opacity: 1;
		transform: translateY(0);
	}

	&.is-expanded:before {
		pointer-events: auto;
	}

	&:before {
		pointer-events: none;
		content: '';
		height: 10px;
		position: absolute;
		top: -10px;
		width: 100%;
	}

}

.menu-item {
	margin-top: 16px;

	&:first-of-type {
		margin-top: 20px;
	}

	& > a,
	& > button {
		padding: 0 32px 0 20px;
		width: max-content;
		display: block;

		font-family: var(--pilat-wide-font-family);
		font-weight: 400;
		line-height: 18px;
		font-size: 14px;

		transition: all var(--common-transition-duration-easing-function);

		&:hover {
			background: var(--accent-gradient);
			background-clip: text;
			color: transparent;
		}
	}

	&.is-selected {
		& > a,
		& > button {
			color: var(--secondary-dark-text-color);
			pointer-events: none;
		}
	}

}

.header__profile-dropdown {
	.menu-item-list {
		left: unset;
		right: 20px;
	}
}
</style>
