<script setup lang="ts">
import type { FullGame, GamePack } from '@/types/arden';
import type { UserData } from '@/types';
import { STATE_KEYS } from '~/utils/consts';
import { useArden } from '~/composables/arden/useArden';
import usePaystation from '~/composables/game/paystation';
const props = defineProps<{
	game: FullGame | null;
}>();

const xsollaToken = useState<string | undefined>(STATE_KEYS.TOKEN);

const { openPaystation } = usePaystation();

const user = useState<{ data: UserData | null }>('user');
const showAuth = useState<boolean>(STATE_KEYS.SHOW_LOGIN_WIDGET);

const { getPacks, getPacksPage, getCatalogItems, getItemToken, getItemsTokens } = useArden();

const packs = getPacksPage();

const route = useRoute();
const router = useRouter();

const action = route.query.action;
const selectedPackQuery = route.query['selected-pack'];

const selectedPack = computed<GamePack | null>(() => {
	if (selectedPackIndex.value === -1) return null;
	return packs[selectedPackIndex.value];
});

const selectedPackIndex = ref(-1);

async function showPaystation(index?: number) {
	if (index != null) {
		selectedPackIndex.value = index;
	}

	if (!selectedPack.value) return;

	if (!user.value) {
		await router.push({
			...route,
			query: {
				'selected-pack': selectedPack.value.item?.sku,
				action: QUERY_ACTIONS.OPEN_PAYSTATION,
			},
		});
		useShowLogin();
		return;
	}

	if (!selectedPack.value?.item?.token) {
		await getItemToken(selectedPack.value);
	}

	if (!selectedPack.value.item?.token) return;

	openPaystation({
		token: selectedPack.value.item.token,
		isSandbox: selectedPack.value.item.sandbox,
	});
}

onMounted(async () => {
	// получаем все предметы без токена пользователя
	await getCatalogItems();

	if (xsollaToken.value == null) {
		xsollaToken.value = useCookie<string | undefined>(authTokenCookieKey).value;
	}

	// если есть action на открытие paystation и есть выбранный пак
	// то открываем paystation, там же получим токен
	// токен получим только один, на выбранный пак
	if (action === QUERY_ACTIONS.OPEN_PAYSTATION && selectedPackQuery != null) {
		const packIndex = packs.findIndex((p) => p.sku === selectedPackQuery);
		if (packIndex === -1) return;

		showPaystation(packIndex);

		return router.push({
			...route,
			query: {
				'selected-pack': undefined,
				action: undefined,
			},
		});
	}

	// получаем paystation-токены для всех паков, если пользователь залогинен
	if (user.value?.data) {
		await getCatalogItems(xsollaToken.value);
		await getItemsTokens(props.game?.settings.sandbox_mode);
	}
});

watch(xsollaToken, (val) => {
	// получаем предметы с токеном пользователя
	if (val) getCatalogItems(val);
});

watch(user, (val) => {
	if (val?.data) {
		getItemsTokens(props.game?.settings.sandbox_mode);
	}
});
</script>

<template>
	<section :class="$style.container" v-if="packs">
		<h2 :class="$style.title">{{ $t('arden-index.game_page.title') }}</h2>
		<div :class="$style.pack_description" v-html="$t('arden-index.game_page.description')"></div>
		<p>&nbsp;</p>
		<div :class="$style['card-container']">
			<a
				v-for="(pack, index) in packs"
				:key="index"
				@click="showPaystation(index)"
				role="button"
				:data-pixel="`click_btn_game_${pack.item?.sku}`"
				tabindex="0"
				:class="[$style['card'], pack.item?.disabled ? $style['disabled'] : '']">
				<span v-if="pack.item?.is_discount" :class="[$style['economy-amount']]">
					<i18n-t keypath="subscriptionPackages.saveAmount">
						<template #:saveAmount
							>{{ pack.item.currencySymbol }}{{ pack.item.amount }}</template
						>
					</i18n-t>
				</span>

				<p>{{ pack.title }}</p>

				<p :class="$style['monthly-amount']">
					<span :class="$style.value">
						{{ pack.item?.currencySymbol }}{{ pack.item?.amount }}
					</span>
				</p>

				<p v-if="pack.item?.is_discount" :class="$style['total-price']">
					{{ $t('subscriptionPackages.totalPrice') }}
					&nbsp;
					<span>
						{{ pack.item?.currencySymbol }} {{ pack.item?.amount }}&nbsp;/&nbsp;
						<del>
							{{ pack.item?.currencySymbol }} {{ pack.item?.amount_without_discount }}
						</del>
					</span>
				</p>
				<p></p>
				<span :class="[$style['purchase']]" v-if="!pack.item?.disabled">
					{{ $t('game.buy') }}
				</span>
			</a>
		</div>
	</section>
</template>

<style module lang="scss">
@import 'assets/css/variables';
.container {
	display: flex;
	max-width: 1300px;
	margin: 0 auto;
	padding-bottom: 48px;
	flex-wrap: wrap;

	@media (max-width: $max-tablet) {
		padding: 0 20px 48px;
	}
}
.title {
	width: 100%;
	margin-bottom: 48px;

	color: var(--reskin-secondary-light-color);
	text-align: center;
	text-transform: uppercase;
	font-family: var(--pilat-wide-font-family);
	font-weight: 700;
	line-height: 31px;
	font-size: 24px;
}
.pack_description {
	font-size: 16px;
	p {
		word-wrap: normal;
		word-break:normal;
		margin-bottom: 10px;
	}
	span {
		font-size: 12px;
	}
}

.card {
	flex: 1;
	padding: 40px 30px 30px;
	font-family: var(--pilat-wide-font-family);
	display: flex;
	flex-direction: column;
	gap: 18px;
	cursor: pointer;
	line-height: 20px;
	font-size: 16px;
	&:before {
		content: '';
		transition: all var(--common-transition-duration-easing-function);
		background: var(--background-tertiary-color);
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		position: absolute;
	}

	&.active {
		pointer-events: none;
		background: var(--background-tertiary-active-color);
	}

	@media (hover: hover) {
		&:focus,
		&:hover {
			background: var(--background-tertiary-hover-color);

			&:before {
				left: -5px;
				right: -5px;
				top: -5px;
				bottom: -5px;
				background: var(--reskin-quinary-dark-color);
				width: calc(100% + 10px);
				height: calc(100% + 10px);
			}

			& > .purchase {
				background: var(--icon-primary-color);
			}
		}
	}

	&:focus,
	&:active {
		&:before {
			background: var(--background-tertiary-active-color);
		}

		& > .purchase {
			background: var(--icon-primary-active-color);
		}
	}
}
.card.disabled {
	cursor: default;
	opacity: 0.3;
	border: 1px solid #0a0a0a;
}
.title {
	font-family: var(--inter-font-family);
	font-weight: 600;
	line-height: 22px;
}

.monthly-amount {
	font-weight: 400;
	text-transform: uppercase;

	display: flex;
	flex-wrap: wrap;
	row-gap: 8px;

	& > .value {
		font-size: 30px;
	}

	& > .period {
		word-break: break-word;
		vertical-align: bottom;
		line-height: 25px;
	}
}

.economy-amount {
	background: var(--background-positive-color);
	color: var(--text-primary-color);
	font-weight: 700;
	font-size: 14px;
	line-height: 18px;
	padding: 5px 15px;
	text-transform: uppercase;

	position: absolute;
	right: 0;
	top: 0;

	&.max-discount {
		background: var(--background-negative-color);
	}
}

.total-price {
	font-family: var(--inter-font-family);
	font-weight: 400;
	color: var(--text-subhead-color);
	display: flex;
	flex-wrap: wrap;

	& > .value {
		word-break: keep-all;
	}
}

.purchase {
	transition: all var(--common-transition-duration-easing-function);
	display: flex;
	background: var(--icon-accent-color);
	color: var(--text-primary-invariably);
	text-transform: uppercase;
	padding: 16px 24px;
	font-weight: 700;
	justify-content: center;
	margin-top: auto;

	&.active {
		background: #343c67;
		border: 2px #52597e solid;
		color: #52597e;
	}
}
.card-container {
	gap: 20px;
	flex-wrap: wrap;
	display: flex;
	width: 100%;

	@media (max-width: $max-tablet) {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	@media (max-width: $mid-mobile) {
		display: flex;
		flex-direction: column;
	}
}
</style>
