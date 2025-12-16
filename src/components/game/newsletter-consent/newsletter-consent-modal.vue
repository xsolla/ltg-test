<script setup lang="ts">
import LModal from '~/components/base/v2/l-modal.vue';
import SpeakerIcon from '~/components/icon/ui-kit/speaker.vue';
import LInput from '~/components/base/l-input.vue';
import LButton from '~/components/base/v2/l-button.vue';

import { onBeforeMount, ref, computed } from 'vue';
import { useState } from 'nuxt/app';
import CheckIcon from '~/components/icon/ui-kit/check.vue';
import { useNewsletterConsent } from '~/composables/newsletter-consent';
import { useValidateEmail } from '~/composables/forms';
import { XSOLLA_FAMILY_LINK } from '~/constants/common';

import { useI18n, Translation } from 'vue-i18n';

type Emits = {
	(e: 'close'): void;
};

const emit = defineEmits<Emits>();

const { t } = useI18n();

const emailValidationErrorText = ref('');
const emailInputValue = ref('');
const isEmailSaved = ref(false);

const user = useState<{ data: { email: string } } | null>('user');

const { createConsent } = useNewsletterConsent();

const clearValidationError = () => {
	emailValidationErrorText.value = '';
};

const emailInputState = computed(() => {
	return emailValidationErrorText.value ? 'error' : 'default';
});

const onCreateConsentClick = async () => {
	if (!useValidateEmail(emailInputValue.value)) {
		emailValidationErrorText.value = 'Invalid email';
		return;
	}

	await createConsent(emailInputValue.value, 'platform-popup');

	isEmailSaved.value = true;
};

const onCloseClick = () => {
	emit('close');
};

onBeforeMount(() => {
	const email = user.value?.data?.email;

	if (email) {
		emailInputValue.value = email;
	}
});
</script>

<template>
	<LModal @close="onCloseClick">
		<template v-if="!isEmailSaved">
			<span :class="$style['speaker-icon-container']">
				<SpeakerIcon :size="56" />
			</span>
			<h3 :class="$style.title">{{ t('newsletterConsent.titleVariant1') }}</h3>
			<LInput
				v-model="emailInputValue"
				type="email"
				:state="emailInputState"
				:placeholder="t('newsletterConsent.email')"
				size="full-width"
				@focus="clearValidationError" />

			<p v-if="emailValidationErrorText" :class="$style['email-error-text']">
				{{ t('newsletterConsent.invalidEmail') }}
			</p>

			<LButton
				stretch-mode="full-width"
				size="medium"
				variant="accent"
				@click="onCreateConsentClick">
				{{ t('newsletterConsent.subscribe') }}
			</LButton>

			<p :class="$style.footnote">
				<Translation keypath="newsletterConsent.footnote">
					<template #xsollaFamilyLink>
						<a target="_blank" :href="XSOLLA_FAMILY_LINK">Xsolla&nbsp;Family</a>
					</template>
				</Translation>
			</p>
		</template>

		<template v-else>
			<span :class="$style['check-icon-container']">
				<CheckIcon />
			</span>

			<p :class="$style['thank-you']">{{ t('newsletterConsent.thankYou') }}</p>
		</template>
	</LModal>
</template>

<style lang="scss" module>
@import 'assets/css/themes/current';

.thank-you,
.title {
	@include title-3-font-style;

	color: var(--text-primary-color);
	text-align: center;
	width: 100%;
	word-break: break-word;
}

.thank-you,
.title,
.title + input,
.title + input + button {
	margin-top: var(--space-200);
}

.thank-you {
	margin-bottom: var(--space-800);
}

.footnote {
	@include caption-2-font-style;

	color: var(--text-primary-color);
	margin-top: var(--space-200);
	text-align: center;
	//TODO: replace with color
	opacity: 0.5;

	& > a {
		text-decoration: underline;
	}
}

.speaker-icon-container,
.check-icon-container {
	margin-top: var(--space-100);

	& > svg {
		vertical-align: middle;
	}
}

.check-icon-container {
	margin-top: var(--space-700);
}

.email-error-text {
	color: var(--text-negative-color);
	font-weight: 400;
	font-size: 16px;
	line-height: 20px;
	letter-spacing: 0.1px;
	font-family: var(--inter-font-family);
	align-self: flex-start;

	margin: var(--space-100) 0 var(--space-125);
}
</style>
