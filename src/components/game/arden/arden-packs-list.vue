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

const { getPacks, getCatalogItems, getItemToken, getItemsTokens } = useArden();

const packs = getPacks();

const router = useRouter();

async function showPaystation(index?: number) {
	if (index != null) {
		selectedPackIndex.value = index;
	}

	closePopup();

	if (!selectedPack.value) return;

	if (!user.value) {
		await router.push({
			...route,
			query: {
				'selected-pack': selectedPack.value.item?.sku,
				action: QUERY_ACTIONS.OPEN_PAYSTATION,
			},
		});
		showAuth.value = true;
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

const selectedPack = computed<GamePack | null>(() => {
	if (selectedPackIndex.value === -1) return null;
	return packs[selectedPackIndex.value];
});

const selectedPackIndex = ref(-1);
const showPackPopup = ref(false);

function nextPack() {
	if (selectedPackIndex.value === packs.length - 1) return;
	selectedPackIndex.value += 1;
}

function prevPack() {
	if (selectedPackIndex.value === 0) return;
	selectedPackIndex.value -= 1;
}

function openPackPopup(index: number) {
	selectedPackIndex.value = index;
	showPackPopup.value = true;
}

function closePopup() {
	showPackPopup.value = false;
}

const route = useRoute();

const action = route.query.action;
const selectedPackQuery = route.query['selected-pack'];

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
	<section class="packs">
		<div class="compact-container" id="packs">
			<div class="compact-container__wrap">
				<h2 class="content-title">{{ $t('arden-index.pack_title') }}</h2>
				<div class="packs__list">
					<GameArdenPackCard
						v-for="(pack, index) in packs"
						:key="index"
						:pack="pack"
						@view-more="openPackPopup(index)"
						@show-paystation="showPaystation(index)" />
				</div>
			</div>
		</div>

		<GameArdenPackPopup
			v-if="showPackPopup && selectedPack"
			:pack="selectedPack"
			@close="closePopup"
			@show-paystation="showPaystation"
			:is-first="selectedPackIndex === 0"
			:is-last="selectedPackIndex === packs.length - 1"
			@next-pack="nextPack"
			@prev-pack="prevPack" />
	</section>
</template>

<style lang="scss" scoped>
.content-title {
	margin: 0 auto 40px;
	color: #ffffff;
	font-family: 'Goudy Trajan', serif;
	font-size: 48px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	text-transform: uppercase;
	text-align: center;

	@media screen and (max-width: 768px) {
		max-width: 80%;
		font-size: 30px;
	}
}

.compact-container {
	//position: absolute;
	//width: 100%;
	//height: 80%;
	display: flex;
	align-items: center;
	justify-content: center;

	.compact-container__wrap {
		width: 100%;

		@media screen and (max-width: 1024px) {
			margin-left: 20px;
			margin-right: 20px;
		}
	}

	@media screen and (max-width: 1024px) {
		width: initial;
		height: initial;
		position: relative;
	}
}

.packs {
	position: relative;
	z-index: 3;
	min-height: 100vh;
	padding: 1vh 0 60px 0;
	background-image: linear-gradient(180deg, #010000 20%, transparent 20%);

	.title {
		position: relative;
		z-index: 10;
		margin: 0 auto 50px;
		text-align: center;
	}

	&:before,
	&:after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		z-index: -1;
		width: 100%;
		background-size: cover;
		background-repeat: no-repeat;

		@media screen and (max-width: 1024px) {
			display: block;
			height: 40%;
		}

		@media screen and (max-width: 768px) {
			height: 30%;
		}
	}

	&:before {
		left: 0;
		top: -1vh;
		height: calc(120% - 10vh);
		background-image: url('https://cdn.ltg.com/lif/images/cbt/packs-bg.png');
		background-position: center top;

		@media screen and (max-width: 1024px) {
			top: 52px;
			height: auto;
			min-height: 50%;
			background-image: url(https://cdn.ltg.com/lif/images/cbt/packs-bg-mob-top.png);
			background-position: center top;
			background-size: 100%;
		}
	}

	&:after {
		display: none;

		@media screen and (max-width: 1024px) {
			bottom: 0;
			display: block;
			background-image: url(https://cdn.ltg.com/lif/images/cbt/packs-bg-mob-bottom.png);
			background-position: center bottom;
		}
	}

	@media screen and (max-width: 1024px) {
		padding-bottom: 200px;
		background-image: linear-gradient(to bottom, rgb(0, 0, 0) 70%, rgba(0, 0, 0, 0.1));
	}
}

.packs__list {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 20px;
	height: 100%;

	@media screen and (max-width: 1024px) {
		flex-direction: column;
	}
}
</style>
