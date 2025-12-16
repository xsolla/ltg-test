<script setup lang="ts">
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

type Step = {
	index: number;
	nameKey: string;
	descriptionKey: string;
	imageSrc: string;
};
type Props = {
	step: Step;
};

const props = defineProps<Props>();

const { t } = useI18n();
</script>

<template>
	<article :class="$style.container">
		<span :class="$style['step-index']">{{ step.index }}</span>

		<img :class="$style.image" :src="step.imageSrc" :alt="t(step.nameKey)" />

		<h3 :class="$style.title">{{ t(step.nameKey) }}</h3>

		<p :class="$style.description">
			{{ t(step.descriptionKey) }}
		</p>
	</article>
</template>

<style module lang="scss">
.step-index {
	font-weight: 700;
	font-family: var(--pilat-wide-font-family);
	font-size: 32px;
	line-height: 41px;
	color: var(--white-50);
}

.image {
	margin-top: 20px;
	width: 100%;
}

.container {
	flex: 1;
	padding: 30px;
	background: #161d45;
	display: flex;
	flex-direction: column;
}

.title {
	margin-top: 20px;
	font-size: 28px;
	font-weight: 600;
	font-family: var(--pilat-wide-font-family);
	color: var(--reskin-primary-light-text-color);

	word-break: break-word;
}

.description {
	font-weight: 500;
	color: var(--white-75);
	font-size: 14px;
	line-height: 24px;

	word-break: break-word;
	margin-top: 10px;
	white-space: pre-line;
}
</style>
