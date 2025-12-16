<script setup lang="ts">
import Snackbar from '~/components/base/snackbar.vue';
import SpeakerIcon from '~/components/icon/ui-kit/speaker.vue';
import { useI18n } from 'vue-i18n';

type Emits = {
	(e: 'remind-later' | 'close' | 'subscribe'): void;
};

const { t } = useI18n();

const emit = defineEmits<Emits>();

const onSubscribeButtonClick = () => {
	emit('subscribe');
};

const onCloseClick = () => {
	emit('close');
};

const onRemindMeLaterClick = () => {
	emit('remind-later');
};
</script>

<template>
	<Snackbar :title="t('newsletterConsent.titleVariant1')" @close="onCloseClick">
		<template v-slot:icon>
			<SpeakerIcon />
		</template>

		<template v-slot:body>
			<div :class="$style['content-container']">
				<p :class="$style.description">
					{{ t('newsletterConsent.description') }}
				</p>

				<button @click="onSubscribeButtonClick" :class="[$style.button, $style.accent]">
					{{ t('newsletterConsent.subscribe') }}
				</button>
				<button @click="onRemindMeLaterClick" :class="[$style.button, $style.secondary]">
					{{ t('newsletterConsent.remindMeLater') }}
				</button>
			</div>
		</template>
	</Snackbar>
</template>

<style lang="scss" module>
@import 'assets/css/themes/current';
@import 'assets/css/variables';

.description {
	@include footnote-font-style;

	color: var(--text-secondary-color);
	word-break: break-word;

	margin-bottom: var(--space-75);
}

.content-container {
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-left: var(--space-450);
	gap: var(--space-125);
}

.button {
	font-size: 14px;
	font-weight: 600;
	font-family: var(--inter-font-family);
	line-height: 20px;
	white-space: pre;
	min-width: 100px;
	flex: auto;

	color: var(--text-primary-color);
	padding: var(--space-100) var(--space-200);
	border: 1px var(--stroke-separator-primary-alpha-color) solid;
	transition: var(--common-transition-duration-easing-function);
	transition-property: background;

	&.accent {
		border: none;
		background: var(--background-secondary-alpha-color);
	}

	&:hover {
		background: rgba(255, 255, 255, 0.24); // TODO: needs to be linked with design

		&.secondary {
			border: none;
			padding: calc(var(--space-100) + 1px) calc(var(--space-200) + 1px);
		}
	}
}
</style>
