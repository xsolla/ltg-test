<script setup lang="ts">
import type { Promocode } from '~/types';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onClickOutside } from '@vueuse/core';

type Props = {
	items: Promocode[];
	selectedItem: Promocode | null;
};

type Emits = {
	(eventName: 'promocode-selected', item: Promocode | null): void;
	(eventName: 'close-click'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const dropdownElement = ref<HTMLElement>();

const itemList = computed(() => {
	return [
		{
			promocode: null,
		},
		...props.items.map((item) => ({ promocode: item })),
	];
});

const getBadgeText = (item: Promocode) => {
	return item.type === 'subscription' ? `Trial ${item.qty} days` : `${item.qty}%`;
};

const getInputName = (item: Promocode | null, index: number) => {
	const stringifiedCode = item ? item.code : 'not-selected';

	return `promocode-${stringifiedCode}-${index}`;
};

const formatItemTitle = (item: Promocode | null) => {
	if (!item) {
		return t('game.promocodeNotSelected');
	}

	const { code } = item;

	if (code.length <= 12) {
		return code;
	}

	return `${code.slice(0, 4)}-....-${code.slice(code.length - 4, code.length)}`;
};

onClickOutside(dropdownElement, () => {
	emit('close-click');
});
</script>

<template>
	<button :class="$style.backdrop" />

	<ul ref="dropdownElement" :class="$style.container">
		<li :class="$style.item" v-for="({ promocode }, i) in itemList" :key="i">
			<input
				name="purchase-promocode"
				:value="promocode?.code"
				:checked="promocode?.code === selectedItem?.code"
				:id="getInputName(promocode, i)"
				:class="$style.input"
				type="radio" />

			<label
				@click="emit('promocode-selected', promocode)"
				:for="getInputName(promocode, i)"
				:class="$style.label">
				<span :class="$style.title">{{ formatItemTitle(promocode) }}</span>

				<span v-if="promocode" :class="$style.badge">{{ getBadgeText(promocode) }}</span>
			</label>
		</li>
	</ul>
</template>

<style lang="scss" module>
@import 'assets/css/themes/current';

.backdrop {
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: var(--background-contrast-alpha-color);
	position: fixed;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	z-index: 3;
	width: 100%;
	display: none;

	@media (max-width: 480px) {
		display: flex;
	}
}

.container {
	z-index: 2;
	position: absolute;
	right: 0;
	top: calc(100% + var(--space-150));
	background: var(--background-secondary-color);
	width: 400px;
	border-radius: var(--radius-150);
	padding: var(--space-100);
	max-height: 236px;
	overflow-y: scroll;

	&::-webkit-scrollbar-track {
		margin: 8px 0;
		border-radius: var(--radius-125);
		background: none;
	}

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-thumb {
		border-radius: var(--radius-125);
		background-color: var(--background-secondary-alpha-color);

		&:active {
			background-color: red;
		}
	}

	@media (max-width: 480px) {
		bottom: 0;
		left: 0;
		right: 0;
		top: auto;
		width: auto;
		position: fixed;
		z-index: 3; // TODO: move to constants etc
	}
}

.input {
	display: none;
}

.input[type='radio']:checked + .label:before {
	border: 5px #fff solid;
}

.label:before {
	content: '';
	width: 18px;
	height: 18px;
	border: 1px rgba(255, 255, 255, 0.2) solid;
	border-radius: 100px;
	margin-right: var(--space-125);
}

.item {
	width: 100%;
}

.title {
	margin-right: auto;
}

.item > label {
	@include headline-1-font-style;

	color: var(--text-primary-color);
	display: flex;
	align-items: center;
	padding: var(--space-150) var(--space-200);
	width: 100%;
	flex-wrap: wrap;
	row-gap: var(--space-75);
	cursor: pointer;
	transition: background var(--common-transition-duration-easing-function);
	border-radius: var(--radius-100);

	&:hover {
		background: var(--background-secondary-alpha-color);
	}

	&:active {
		background: rgba(255, 255, 255, 0.05);
	}
}

.badge {
	background: var(--background-negative-color);
	font-family: var(--pilat-wide-font-family);
	font-weight: 900;
	font-size: 12px;
	line-height: 12px;
	color: var(--text-primary-color);
	border-radius: var(--space-50);
	padding: 3px var(--space-100);
	white-space: pre;
}
</style>
