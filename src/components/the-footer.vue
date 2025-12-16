<script setup>
import SocialElement from '~/components/social-element.vue';
import MenuElement from '~/components/menu-element.vue';
import Link from '~/components/base/link.vue';
import useMobileTablet from '@/composables/mobile-tablet-desktop';
import LButton from '~/components/base/v2/l-button.vue';
import {
	menu,
	socials,
	logo,
	privacy,
	terms,
	business,
	balanceRestorationTerms,
} from '@/utils/ltg';
import { useNuxtApp } from 'nuxt/app';
const { mobile } = useMobileTablet();
const { $gdpr } = useNuxtApp();

const elements = Object.assign([], menu).filter((el) => !el.dropdown);

const userLang = ref('en')
if (process.server) {
	const h = useRequestHeaders(['accept-language'])
	userLang.value = h['accept-language']?.split(',')[0]?.toLowerCase() || 'en'
} else {
	onMounted(() => {
		userLang.value = (navigator.language || navigator.userLanguage )?.toLowerCase()
	})
}
const btnCookieRaw = computed(() =>
	userLang.value == 'en-us'
		? 'Do Not Sell Or Share My Personal Information'
		: 'Privacy Settings'
)
const onCookiesButtonClick = () => {
	$gdpr.show();
};

const year = new Date().getFullYear();
</script>

<template>
	<div class="footer-inner">
		<div class="footer-inner__top">
			<div class="container footer-inner__container">
				<Link class="footer-inner__logo" to="/">
					<img class="footer-logo" :src="logo" alt="Logo" />
				</Link>

				<template v-if="mobile">
					<p>© {{ year }} LTG.</p>
					<p>{{ $t('footer.allRightsReserved') }}</p>
				</template>

				<ul class="fd-r-M fd-c list-reset footer__menu">
					<li v-for="(item, i) of elements" :key="i">
						<MenuElement variant="footer" source="footer" :item="item" black />
					</li>
				</ul>
				<ul class="footer-inner__social fd-r">
					<SocialElement v-for="(item, i) of socials" :key="i" :item="item" class="" />
				</ul>
			</div>
		</div>
		<div class="footer-inner__bottom">
			<div class="container">
				<div v-if="!mobile" class="footer__info">
					<div class="">© {{ year }} LTG.</div>
					<div class="">{{ $t('footer.allRightsReserved') }}</div>
				</div>
				<LButton variant="accent" :href="business" data-pixel="ltg-publisher">{{
					$t('footer.aboutLongTaleGames')
				}}</LButton>
				<div class="footer__links">
					<Link data-pixel="terms-of-conditions" :to="terms">{{
						$t('footer.termsOfService')
					}}</Link>
					<Link data-pixel="privacy-policy" :to="privacy">{{
						$t('footer.privacyAndCookiesPolicy')
					}}</Link>
					<Link
						data-pixel="balance-restoration-terms"
						:to="balanceRestorationTerms"
						class=""
						>{{ $t('footer.balanceRestorationTerms') }}</Link
					>

					<button @click="onCookiesButtonClick">{{ btnCookieRaw }}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import 'assets/css/ui';

.footer__info + a {
	min-width: 150px;
}

.footer-inner__container > p {
	font-size: 14px;
	line-height: 17px;
	font-weight: 600;

	&:first-of-type {
		margin: 10px 0 5px;
	}
}

.footer__links {
	& > a,
	& > button {
		width: 100%;
		text-align: right;
	}

	@media (max-width: $max-mobile) {
		margin-top: 20px;

		& > a,
		& > button {
			width: 100%;
			text-align: center;
		}
	}
}
</style>
