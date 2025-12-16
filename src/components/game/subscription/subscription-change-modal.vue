<script setup lang="ts">
import CloseIcon from '~/components/icon/ui-kit/close.vue';
import { useI18n, Translation as I18nT } from 'vue-i18n';
import ZendeskAuthForm from '~/components/zendesk-auth-form.vue';

type Props = {
	currentSubscription: {
		title: string;
		endsOn: string;
	};
};

type Emits = {
	(e: 'close'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();

const onCloseClick = () => {
	emit('close');
};
</script>

<template>
	<Teleport to="body">
		<button @click="onCloseClick" :class="$style.backdrop" />

		<div :class="$style.container">
			<button @click="onCloseClick" :class="$style['close-button']">
				<CloseIcon />
			</button>

			<h2 :class="$style.title">
				{{ t('subscriptionPackages.subscriptionChangeTitle') }}
			</h2>

			<p>
				<i18n-t keypath="subscriptionPackages.currentSubscriptionDescription">
					<template v-slot:title
						><span :class="$style['subscription-title']">{{
							currentSubscription.title
						}}</span></template
					>

					<template v-slot:endsOn>{{ currentSubscription.endsOn }}</template>
				</i18n-t>
			</p>

			<p>
				{{
					t('subscriptionPackages.subscriptionChangeDescription', {
						support: t('subscriptionPackages.toSupport'),
					})
				}}
			</p>

			<ZendeskAuthForm>
				<button type="submit" :class="$style['contact-button']">
					{{ t('subscriptionPackages.contactSupport') }}
				</button>
			</ZendeskAuthForm>

			<button @click="onCloseClick" :class="$style['back-button']">
				{{ t('subscriptionPackages.back') }}
			</button>
		</div>
	</Teleport>
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
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	z-index: 2;
	width: 100%;
}

.container {
	background: var(--background-tertiary-color);
	border-radius: 12px;
	max-width: 480px;
	padding: 40px;
	position: fixed;
	margin: auto;
	align-self: center;
	display: flex;
	flex-direction: column;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 2;
	height: fit-content;

	& > p {
		font-family: var(--inter-font-family);
		line-height: 19px;
		font-size: 14px;
		font-weight: 400;
		color: var(--text-secondary-color);
		text-align: center;
		word-break: break-word;

		& + p {
			margin-top: 8px;
		}

		&:last-of-type {
			margin-bottom: 32px;
		}
	}
}

.title {
	font-weight: 700;
	font-size: 24px;
	line-height: 31px;
	font-family: var(--pilat-wide-font-family);
	color: var(--text-primary-color);
	text-align: center;
	text-transform: uppercase;

	margin-bottom: 32px;
}

.contact-button {
	transition: all var(--common-transition-duration-easing-function);
	background: var(--icon-accent-color);
	width: 100%;
	padding: 20px 0;
	color: #000;
	text-transform: uppercase;
	font-size: 16px;
	font-weight: 700;
	line-height: 21px;
	display: block;
	text-align: center;
	font-family: var(--pilat-wide-font-family);

	&:hover {
		background: var(--icon-primary-color);
	}

	&:active,
	&:focus {
		background: var(--icon-primary-active-color);
	}
}

.back-button {
	width: 100%;
	margin-top: 16px;
	font-weight: 700;
	line-height: 18px;
	font-size: 14px;
	font-family: var(--pilat-wide-font-family);
	padding: 17px 0;
	text-transform: uppercase;
	color: var(--text-primary-color);
}

.subscription-title {
	text-transform: uppercase;
}

.close-button {
	position: absolute;
	right: 10px;
	top: 10px;
	padding: 5px;

	& > svg > path {
		fill: var(--text-primary-color);
	}
}
</style>
