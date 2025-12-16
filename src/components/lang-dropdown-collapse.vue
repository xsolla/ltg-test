<script setup>
import { ref, computed } from 'vue';
import { languages, localeCookieKey } from '@/utils/ltg';
import ArrowDownIcon from '~/components/icon/arrow-down.vue';
import Simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

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

const isExpanded = ref(false);

</script>

<template>
	<div :class="['language-selector', { isCollapsed: !isExpanded }]">
		<button class="language-button" @click="isExpanded = !isExpanded">
			<span>{{ selectedLanguage.name }}</span>
			<ArrowDownIcon />
		</button>
		<div class="language-box" :class="{ expanded: isExpanded }">
			<Simplebar class="scrolled-list" ref="simplebarRef" :auto-hide="false">
				<ul class="language-list">
					<li
						v-for="(language, index) in languages"
						:key="index"
						class="language-item"
						@click="setLocale(language.locale)">
						{{ language.name }}
					</li>
				</ul>
			</Simplebar>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.language-selector {
	position: relative;
	width: 100%;
	max-width: 300px;
	transition: all 0.3s ease;
}

.language-selector.isCollapsed {
	.language-box {
		height: 0;
	}

	.language-button svg {
		transform: rotate(0deg);
	}
}

.language-button {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	padding: 10px;
	border: none;
	color: var(--white);
	cursor: pointer;
	font-size: 16px;
	font-family: 'Pilat Wide', 'Montserrat', Helvetica, Arial, sans-serif;
	text-align: left;
	transition: background-color 0.3s;

	&:hover {
		background-color: var(--primary-dark-color);
	}

	svg {
		fill: #ffffff;
		transform: rotate(-180deg);
	}

	svg path {
		fill: #ffffff;
	}

	span {
		font-size: 16px;
		font-family: 'Pilat Wide', 'Montserrat', Helvetica, Arial, sans-serif;
	}
}

.language-box {
	transition: max-height 0.3s ease;
	overflow: hidden;
	max-height: 0;

	&.expanded {
		max-height: 200px;
	}
}

.scrolled-list {
	max-height: 200px; // Должна совпадать с .language-box
	overflow-y: auto;
}

.language-item {
	padding: 10px;
	font-size: 14px;
	font-family: 'Pilat Wide', 'Montserrat', Helvetica, Arial, sans-serif;
	cursor: pointer;
	transition: background-color 0.3s;

	&:hover {
		background-color: var(--secondary-color);
		color: var(--white);
	}

	&:not(:last-child) {
		border-bottom: 1px solid var(--divider-color);
	}
}

.scrolled-list {
	list-style: none;
	margin: 0;
	padding: 0;
	max-height: 200px;
	overflow-y: auto;

	.simplebar-scrollbar  {
		opacity: 1 !important;
	}

	 .simplebar-track.simplebar-vertical  {
		visibility: visible !important;
	}

	.simplebar-content-wrapper {
		scrollbar-width: auto;
		-ms-overflow-style: auto;
	}

	.simplebar-content-wrapper::-webkit-scrollbar,
	.simplebar-hide-scrollbar::-webkit-scrollbar {
		display: initial;
		width: initial;
		height: initial;
	}

	.simplebar-vertical {
		border-radius: 2px;
		right: -16px;
		top: 12px;
		width: 7px;

		.simplebar-scrollbar {
			border-radius: 5px;
			width: 5px;
		}
	}
}
</style>
