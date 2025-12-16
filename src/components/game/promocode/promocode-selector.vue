<script setup lang="ts">
import type { Promocode } from '~/types';
import PromocodeDropdown from '~/components/game/promocode/promocode-dropdown.vue';
import { defineProps, defineEmits, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type Props = {
	selectedPromocode: Promocode | null;
	promocodes: Promocode[];
};

type Emits = {
	(eventName: 'promocode-selected', item: Promocode | null): void;
};

defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const isDropdownVisible = ref<boolean>(false);

const onToggleExpansionClick = () => {
	isDropdownVisible.value = !isDropdownVisible.value;
};

const onPromocodeSelected = (promocode: Promocode | null) => {
	emit('promocode-selected', promocode);

	isDropdownVisible.value = false;
};
</script>

<template>
	<p :class="$style.paragraph">
		<template v-if="selectedPromocode">
			{{ t('game.promocodeApplied') }}
			<button @click="onToggleExpansionClick">{{ t('game.changePromocode') }}</button>
		</template>

		<template v-else>
			<button @click="onToggleExpansionClick">{{ t('game.selectPromocode') }}</button>
		</template>
	</p>

	<PromocodeDropdown
		v-if="isDropdownVisible"
		@promocode-selected="onPromocodeSelected"
		@close-click="onToggleExpansionClick"
		:selected-item="selectedPromocode"
		:items="promocodes" />
</template>

<style lang="scss" module>
@import 'assets/css/themes/current';

.paragraph {
	@include headline-2-font-style;

	color: var(--text-secondary-color);
	text-transform: none;

	& > button {
		font-size: 15px;
		line-height: 20px;
		font-family: var(--inter-font-family);
		text-decoration: underline;
	}

	@media (max-width: 468px) {
		width: 100%;
		align-items: center;
		justify-content: center;
		text-align: center;
		display: grid;

		& > button {
			justify-self: center;
			display: flex;
			align-self: center;
		}
	}
}
</style>
