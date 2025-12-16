<script setup>
import { languages, localeCookieKey } from '@/utils/ltg';
import LDropdown from '~/components/base/l-dropdown.vue';
import ArrowDownIcon from '~/components/icon/arrow-down.vue';

const { $i18n, $f9 } = useNuxtApp();

const selectedLanguage = computed(() => {
	const language = languages.find(({ locale }) => $i18n.locale.value === locale);
	return language || languages[0];
});

async function setLocale(locale) {
	useCookie(localeCookieKey).value = locale;
	$i18n.setLocale(locale);
	$f9.setHeaders({ locale });
	isExpanded.value = false;
}

const dropdownMenuItems = computed(() =>
	languages.map((item) => {
		return {
			value: item.locale,
			title: item.name,
			isSelected: item.locale === selectedLanguage.value.locale,
		};
	})
);

const isExpanded = ref(false);

const onExpansionChange = (isDropdownExpanded) => {
	isExpanded.value = isDropdownExpanded;
};
</script>
<template>
	<LDropdown
		:is-expanded="isExpanded"
		:menu-items="dropdownMenuItems"
		@toggle-expansion="onExpansionChange"
		@menu-item-click="setLocale"
		class="l-dropdown">
		<template #expansion-button-content>
			<span class="l-dropdown__name">
				{{ selectedLanguage.name }}
			</span>
			<ArrowDownIcon />
		</template>
	</LDropdown>
</template>
<style lang="scss" scoped>
::v-deep(.is-expanded) {
	// Стили для состояния, когда dropdown активен
}

.l-dropdown {
	z-index: 2000;
}

.l-dropdown__name {
	font-weight: 400;
	font-family: var(--pilat-wide-font-family);
	line-height: 40px;
	font-size: 14px;
	color: var(--white);
	margin-right: 5px;
	transition: all var(--common-transition-duration-easing-function);

	& + svg {
		fill: var(--white);
		align-self: center;
	}

	&:hover {
		color: var(--reskin-tertiary-light-color);

		& + svg {
			fill: var(--reskin-tertiary-light-color);
		}
	}

	&.active,
	&:active {
		color: #9da4c6;

		& + svg {
			fill: #9da4c6;
		}
	}
}

</style>
