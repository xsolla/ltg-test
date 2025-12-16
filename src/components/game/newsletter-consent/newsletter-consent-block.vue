<script lang="ts" setup>
import LInput from '~/components/base/l-input.vue';
import LButton from '~/components/base/v2/l-button.vue';
import { ref, onBeforeMount, computed } from 'vue';
import { useState } from 'nuxt/app';
import CheckIcon from '~/components/icon/ui-kit/check.vue';
import { useValidateEmail } from '~/composables/forms';
import { useNewsletterConsent } from '~/composables/newsletter-consent';
import { XSOLLA_FAMILY_LINK } from '~/constants/common';
import { useI18n, Translation } from 'vue-i18n';

const { t } = useI18n();

const isEmailSaved = ref(false);
const emailValidationErrorText = ref('');
const emailInputValue = ref('');

const user = useState('user');

const { createConsent, isVisible: isNewsletterConsentVisible } = useNewsletterConsent();

const clearValidationError = () => {
	emailValidationErrorText.value = '';
};

const emailInputState = computed(() => {
	return emailValidationErrorText.value ? 'error' : 'default';
});

const onCreateNewsletterConsentClick = async () => {
	if (!useValidateEmail(emailInputValue.value)) {
		emailValidationErrorText.value = 'Invalid email';
		return;
	}

	isEmailSaved.value = true;

	await createConsent(emailInputValue.value, 'platform-popup');
};

onBeforeMount(() => {
	const userValue = user.value as { data: { email: string } } | null;
	const email = userValue?.data?.email;

	if (email) {
		emailInputValue.value = email;
	}
});
</script>

<template>
	<section v-if="isNewsletterConsentVisible || isEmailSaved" :class="$style.container">
		<template v-if="!isEmailSaved">
			<h3 :class="$style.title">
				{{ t('newsletterConsent.titleVariant2') }}
			</h3>

			<div :class="$style.inputContainer">
				<LInput
					@focus="clearValidationError"
					type="email"
					:state="emailInputState"
					:placeholder="t('newsletterConsent.email')"
					size="large"
					v-model="emailInputValue" />

				<LButton @click="onCreateNewsletterConsentClick" variant="accent">
					{{ t('newsletterConsent.subscribe') }}
				</LButton>

				<p v-if="emailValidationErrorText" :class="$style['email-error-text']">
					{{ t('newsletterConsent.invalidEmail') }}
				</p>

				<p :class="$style.footnote">
					<Translation keypath="newsletterConsent.footnote">
						<template v-slot:xsollaFamilyLink>
							<a target="_blank" :href="XSOLLA_FAMILY_LINK">Xsolla&nbsp;Family</a>
						</template>
					</Translation>
				</p>
			</div>
		</template>

		<template v-else>
			<CheckIcon />

			<p :class="$style['thank-you']">{{ t('newsletterConsent.thankYou') }}</p>
		</template>
	</section>
</template>

<style lang="scss" module>
@import 'assets/css/variables';
@import 'assets/css/themes/current';

.container {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;

	max-width: calc(1024px + var(--space-250) * 2);
	margin: 0 auto;

	padding: var(--space-800) var(--space-250);
}

.title {
	@include title-3-font-style;

	color: var(--text-primary-color);
	width: 100%;
	text-align: center;
	white-space: pre-line;

	@media (max-width: $max-mobile) {
		@include footnote-font-style;
	}
}

.inputContainer {
	margin-top: var(--space-400);

	width: 100%;
	max-width: 640px;
	display: grid;
	grid-template-columns: 1fr auto;
	grid-column-gap: 10px;

	@media (max-width: $max-mobile) {
		margin-top: var(--space-300);
		grid-column-gap: 0px;

		& > button {
			// TODO: discuss with designers, needs to be moved into button sizes

			font-size: 14px;
			font-weight: 700;
			line-height: 16px;
			padding: var(--space-150) var(--space-225);
		}
	}
}

.footnote {
	@include footnote-font-style;

	opacity: 0.5;
	color: var(--text-primary-color);
	text-align: center;
	word-break: break-word;

	grid-column: 1 / 3;
	margin-top: var(--space-100);

	& > a {
		text-decoration: underline;
	}

	@media (max-width: $max-mobile) {
		margin-top: var(--space-125);

		@include caption-3-font-style;
	}
}

.thank-you {
	@include title-3-font-style;

	width: 100%;
	text-align: center;
	margin-top: var(--space-200);

	color: var(--text-primary-color);
}

.email-error-text {
	color: var(--text-negative-color);
	font-weight: 400;
	font-size: 16px;
	line-height: 20px;
	letter-spacing: 0.1px;
	font-family: var(--inter-font-family);
	align-self: flex-start;

	margin: var(--space-100) 0 0;
}
</style>
