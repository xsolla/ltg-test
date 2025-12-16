<script setup lang="ts">
import { ref } from 'vue';
import { localeCookieKey } from '~/utils/ltg';
import {
	type DeepLinkPayload,
	handleCopyLink,
	handleEmail,
	handleFacebook,
	handleReddit,
	handleTelegram,
	handleTwitter,
	handleWhatsApp,
} from '~/components/game/utils/shareToGetReward';
import { showError } from 'nuxt/app';

type ProviderData = {
	enabled: boolean;
	localeTexts: {
		text: string;
		subject?: string;
		locale: string;
	}[];
};

type Props = {
	data: {
		enabled: boolean;

		email: ProviderData;
		facebook: ProviderData;
		link: ProviderData;
		reddit: ProviderData;
		telegram: ProviderData;
		twitter: ProviderData;
		whatsapp: ProviderData;
	};
	game: Record<string, unknown>;
};

const props = defineProps<Props>();
const emit = defineEmits(['close', 'success']);

const { $api, $i18n } = useNuxtApp();

const locale = useCookie(localeCookieKey).value;

const isOtherVariantsExpanded = ref(false);

const toggleOtherVariantsExpanded = () => {
	isOtherVariantsExpanded.value = !isOtherVariantsExpanded.value;
};

const lastActivatedPromocode = ref<Record<string, unknown> | null>(null);
const shareButtonDisabled = ref<boolean>(false);

const handleShare = async (method: string) => {
	shareButtonDisabled.value = true;
	try {
		const shareData = await $api.shareToGetReward(
			(props.game as any)._id,
			method,
			locale || 'en'
		);
		if (shareData.status === 'error') {
			shareButtonDisabled.value = false;
			showError('Something went wrong!');
		}
	} catch (e) {
		console.error('Error', e);
		shareButtonDisabled.value = false;
		showError('Something went wrong!');
	}
	const userPromocodes = await $api.getUsersPromocodes();

	const mapTime = (el: unknown) =>
		new Date((el as { activationDate: string }).activationDate).getTime();
	const lastActivationDate = Math.max(...userPromocodes.map(mapTime));
	lastActivatedPromocode.value = userPromocodes.find(
		(el) => mapTime(el) === lastActivationDate
	) as Record<string, unknown>;
	shareButtonDisabled.value = false;
	emit('success');
};

type ProviderMetadata = {
	imgSrc: string;
	displayName: string;
	handler: (payload: DeepLinkPayload) => void;
};

const providerMetadata: Record<string, ProviderMetadata> = {
	link: {
		imgSrc: '/icons/copy-link.svg',
		displayName: 'Copy link',
		handler: handleCopyLink,
	},
	facebook: {
		imgSrc: '/socials/facebook-no-background.svg',
		displayName: 'Facebook',
		handler: handleFacebook,
	},
	twitter: {
		imgSrc: '/socials/twitter.svg',
		displayName: 'X',
		handler: handleTwitter,
	},
	reddit: {
		imgSrc: '/socials/reddit.svg',
		displayName: 'Reddit',
		handler: handleReddit,
	},
	telegram: {
		imgSrc: '/socials/telegram.svg',
		displayName: 'Telegram',
		handler: handleTelegram,
	},
	whatsapp: {
		imgSrc: '/socials/whatsapp.svg',
		displayName: 'WhatsApp',
		handler: handleWhatsApp,
	},
	email: {
		imgSrc: '/socials/email.svg',
		displayName: 'Email',
		handler: handleEmail,
	},
};

const router = useRouter();

const navigateToProfile = () => {
	router.push('/profile/promocodes');
};

const availableProviders = computed(() => {
	const { link, facebook, twitter, reddit, telegram, whatsapp, email } = props.data;
	return [
		{ type: 'link', data: link },
		{ type: 'facebook', data: facebook },
		{ type: 'twitter', data: twitter },
		{ type: 'reddit', data: reddit },
		{ type: 'telegram', data: telegram },
		{ type: 'whatsapp', data: whatsapp },
		{ type: 'email', data: email },
	]
		.filter((provider) => provider.data.enabled && provider.data.localeTexts.length)
		.map((provider) => {
			const localeText =
				provider.data.localeTexts.find((el) => el.locale === locale) ||
				provider.data.localeTexts.find((el) => el.locale === 'en') ||
				provider.data.localeTexts[0];
			const metadata = providerMetadata[provider.type];
			return {
				type: provider.type,
				text: localeText.text,
				imgSrc: metadata.imgSrc,
				displayName: metadata.displayName,
				handler: () => {
					metadata.handler({
						subject: localeText.subject,
						payload: localeText.text,
						callback: () => handleShare(provider.type),
					});
				},
			};
		});
});

const mainPageProviders = computed(() => {
	return availableProviders.value.slice(0, 3);
});

const promocodeActivatedAt = computed(() => {
	if (!lastActivatedPromocode.value) {
		return '';
	}
	const dateString = lastActivatedPromocode.value.activationDate as string;
	return dateString.split('T')[0].split('-').join('.');
});

const promocodeName = computed(() => {
	// @ts-expect-error
	return lastActivatedPromocode.value?.promocode?.pack?.name || '';
});

const getDisplayNameByProvider = (provider: { type: string; displayName: string }) => {
	if (provider.type === 'link') {
		return $i18n.t('game.shareByCopyLink') || 'Copy link';
	}
	return provider.displayName;
};
</script>
<script lang="ts">
export default {
	name: 'ShareToGetRewardModal',
};
</script>
<template>
	<div class="modal" @click="$emit('close')">
		<div
			class="modal__wrapper"
			@click.stop
			v-if="!isOtherVariantsExpanded && !lastActivatedPromocode">
			<header class="modal__header">
				<h2>{{ $t('game.shareToGetReward') }}</h2>
				<button class="close modal__close" color="dark" @click="$emit('close')">
					<img class="" src="/icons/close.svg" alt="close" />
				</button>
			</header>
			<div class="modal__image__wrapper">
				<img class="modal__image" src="/share-modal/gift.gif" />
			</div>
			<div class="button__list">
				<button
					class="button__social"
					v-for="provider of mainPageProviders"
					v-on:click="provider.handler"
					:disabled="shareButtonDisabled"
					v-bind:key="provider.type">
					<div class="button__inner">
						<img :src="provider.imgSrc" />
					</div>
					<span class="button__text">
						{{ getDisplayNameByProvider(provider) }}
					</span>
				</button>
				<button
					class="button__social"
					v-on:click="toggleOtherVariantsExpanded"
					v-if="availableProviders.length > 3">
					<div class="button__inner">
						<img src="/icons/ellipsis.svg" />
					</div>
					<span class="button__text">{{ $t('game.shareToRewardMoreVariants') }}</span>
				</button>
			</div>
		</div>

		<div
			class="modal__wrapper"
			@click.stop
			v-if="isOtherVariantsExpanded && !lastActivatedPromocode">
			<header class="modal__header modal__header_share">
				<span class="header_wrapper">
					<button class="back_button" v-on:click="toggleOtherVariantsExpanded">
						<img src="/icons/arrow-left-white-alternative.svg" />
					</button>
					<h2>{{ $t('game.shareEllipsis') }}</h2>
				</span>
				<button class="close modal__close" color="dark" @click="$emit('close')">
					<img class="" src="/icons/close.svg" alt="close" />
				</button>
			</header>
			<div class="button__large-list">
				<button
					class="button__large-item"
					v-for="provider of availableProviders"
					v-on:click="provider.handler"
					:disabled="shareButtonDisabled"
					v-bind:key="provider.type">
					<img class="button__large-icon" :src="provider.imgSrc" />
					<span class="button__large-text">
						{{ getDisplayNameByProvider(provider) }}
					</span>
				</button>
			</div>
		</div>

		<div class="modal__wrapper" @click.stop v-if="lastActivatedPromocode">
			<header class="modal__header">
				<h2>{{ $t('game.shareToGetReward') }}</h2>
				<button class="close modal__close" color="dark" @click="$emit('close')">
					<img class="" src="/icons/close.svg" alt="close" />
				</button>
			</header>
			<div class="modal__image__wrapper">
				<img class="modal__image__success" src="/share-modal/gift-open.png" />
			</div>

			<div class="promocode__info__wrapper">
				<div class="promocode__info__icon">
					<img src="/icons/lif-mmo-2x.png" />
				</div>
				<div class="promocode__info__text">
					<span class="promocode__info__text_header">
						{{ promocodeName }}
					</span>
					<div class="promocode__info__text_description">
						<img src="/icons/check-mark.svg" />
						<span> {{ $t('promocodes.activated') }}: {{ promocodeActivatedAt }} </span>
					</div>
				</div>

				<button class="promocode__goto_profile_btn" v-on:click="navigateToProfile">
					<img src="/icons/chevron-right.svg" />
				</button>
			</div>

			<button @click="$emit('close')">{{ $t('common.close') }}</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import 'assets/css/ui';

.modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(18, 15, 44, 0.8);

	@media screen and (max-width: $max-mobile) {
		padding: 10px;
	}
}

.modal__wrapper {
	width: 100%;
	max-width: 400px;
	padding: 30px;
	background-color: var(--background-secondary-color);
	display: flex;
	flex-direction: column;
	gap: 20px;

	@media screen and (max-width: $max-mobile) {
		max-width: unset;
		padding: 30px 20px;
		background-color: var(--medium-darker-color);
	}
}

.modal__image__wrapper {
	padding: 12px;
	display: flex;
	width: 100%;
	justify-content: center;

	@media screen and (max-width: $max-mobile) {
		padding: 0;
	}
}

.modal__image {
	max-width: 182px;
	max-height: 182px;
}

.modal__image__success {
	max-width: 112px;
	max-height: 135px;
}
.modal__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0 0 28px 0;

	h2 {
		margin: 0;
		font-size: 18px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
	}

	@media screen and (max-width: $max-mobile) {
		margin: 0;
	}
}

.modal__header_share {
	margin: 4px;
}

.header_wrapper {
	display: flex;
	align-items: flex-end;
	gap: 12px;
}

.modal__close {
	width: 24px;
	height: 24px;
	transition: opacity linear 0.2s;

	img {
		width: 100%;
	}

	&:hover {
		opacity: 0.7;
	}
}

.button__list {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 2px;
}

.button__social {
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;

	&:disabled {
		cursor: default;
		opacity: 0.5;
	}

	&:hover {
		.button__inner {
			padding: 20px;
			border: 1px solid var(--background-positive-color);
		}
	}

	&:active {
		.button__inner {
			padding: 20px;
			border: 1px solid var(--background-positive-color);
		}
	}
}

.button__inner {
	max-width: 60px;
	width: 100%;
	max-height: 60px;
	height: 100%;
	background-color: var(--background-secondary-alpha-color);
	border-radius: 12px;
	padding: 21px;

	img {
		width: 18px;
		height: 18px;
	}

	@media screen and (max-width: $max-mobile) {
		border-radius: 30px;
		background-color: var(--ui-accent-dark-blue);
		border: 1px solid #302d53;
	}
}

.button__text {
	font-family: Montserrat;
	font-size: 12px;
	font-weight: 400;
	line-height: 14px;
	text-align: center;
	color: var(--text-primary-color);
	text-transform: unset;
}

.button__large-list {
	display: flex;
	flex-direction: column;
	margin: 0 -22px;
}

.button__large-item {
	display: flex;
	padding: 14px 20px;
	gap: 10px;
	transition: all ease 0.3s;

	&:hover {
		background-color: var(--background-secondary-alpha-color);
	}

	&:disabled {
		opacity: 0.7;
	}
}

.button__large-icon {
	width: 20px;
	height: 20px;
}

.button__large-text {
	font-family: Montserrat;
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	text-align: left;
	color: var(--text-primary-color);
}

.modal__content,
.modal-form {
	height: 100%;
}

.modal-form__row {
	margin: 0 0 25px 0;

	label {
		display: block;
		margin: 0 0 5px 0;
		color: #a09cb9;
	}

	&.error {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 70%;

		h3 {
			font-size: 16px;
			margin-bottom: 10px;
			font-weight: 500;
			font-style: normal;
			line-height: normal;
			color: white;
		}

		p {
			opacity: 90%;
			font-size: 12px;
			font-style: normal;
			line-height: normal;
			color: white;
		}

		.form-input {
			border-color: #c00a0a;
		}
	}

	&.success {
		.form-input {
			border-color: #375f06;
		}
	}
}

.modal-form__message {
	display: none;
	margin: 0;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	color: white;
}

.form-input {
	width: 100%;
	padding: 12px 15px;
	border-radius: 5px;
	border: 1px solid #2e2a4d;
	background: #1a1736;
	color: #fff;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;

	& + .modal-form__message {
		padding-top: 5px;
	}

	&:focus,
	&:active {
		border-color: #2e2a4d;
	}
}

.modal-form__buttons {
	margin-top: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.custom-select {
	width: 100%;
}

.wrapper-icon {
	width: 32px;
	height: 32px;
	margin-left: 45%;
	margin-top: 30%;
}

.modal-form__row .modal-checkboxes {
	font-family: 'Montserrat';
	font-style: normal;
	font-weight: 500;
	font-size: 13px;
	line-height: 24px;
	color: #8576fd;
	width: 100%;
	margin-bottom: 15px;
}

.modal-form__row .modal-checkboxes .row {
	width: 100%;
	margin-bottom: 15px;
	top: 15px;
}

.modal-form__row .modal-checkboxes .row a {
	text-decoration: underline;
}

.modal-form__row .modal-checkboxes .row label {
	display: grid;
	grid-template-columns: 1em auto;
	gap: 1.5em;
}

.modal-form__row .modal-checkboxes .row input[type='checkbox'] {
	/* Add if not using autoprefixer */
	-webkit-appearance: none;
	/* Remove most all native input styles */
	appearance: none;
	margin: 0;
	width: 23px;
	height: 23px;

	background: var(--reskin-tertiary-dark-color);
	border: 1px solid var(--reskin-primary-neutral-color);
	position: relative;
}

.modal-form__row .modal-checkboxes .row input[type='checkbox']::before {
	content: '';
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
}

.modal-form__row .modal-checkboxes .row input[type='checkbox']:checked::before {
	background-image: url('public/icons/checkbox-mark.svg');
	background-size: 13px 16px;
	background-repeat: no-repeat;
	background-position: center;
}

.modal-form__row .modal-checkboxes .row input[type='checkbox']:focus {
	outline: 0;
	outline-offset: 0;
	background: var(--reskin-quaternary-dark-color);
	border: 1px solid var(--reskin-secondary-neutral-color);
}

.promocode__info__wrapper {
	display: flex;
	width: 100%;
	padding: 8px;
	align-items: center;
}

.promocode__info__wrapper + button {
	background: var(--background-secondary-alpha-color);
	height: 44px;
	line-height: 44px;
	font-family: var(--pilat-wide-font-family);
	font-weight: 700;
	font-size: 14px;
	text-align: center;
	text-transform: uppercase;
	color: var(--text-tertiary-color);
	transition: all var(--common-transition-duration-easing-function);
	cursor: pointer;

	&:hover {
		background: rgba(255, 255, 255, 0.24);
	}
}

.promocode__info__icon {
	padding: 11px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	background-color: var(--background-primary-color);
	border: 1px solid var(--white-20);

	img {
		width: 30px;
		height: 30px;
	}
}

.promocode__info__text {
	padding: 5.5px 0 5.5px 12px;
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.promocode__info__text_header {
	color: var(--white);
	font-size: 16px;
	font-weight: 600;
	line-height: 19.5px;
}

.promocode__info__text_description {
	color: var(--text-secondary-color);
	font-size: 12px;
	font-weight: 600;
	line-height: 14px;
	gap: 5px;
	display: flex;
	align-items: center;
}

.promocode__goto_profile_btn {
	margin-left: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: transparent;
	border: none;
}
</style>
