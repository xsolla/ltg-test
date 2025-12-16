<template>
	<BaseModal :is-opened="isOpened" :overlap-header="true" title="Balance" @close="close">
		<div class="metaframe-balance">
			<IconSickle width="32" height="32" />
			<span class="title">LIF COINS</span>
			<span class="balance">{{ balance }}</span>
			<a
				class="buySubscription"
				href="https://ltg.com/game/life-is-feudal?action=open-paystation">
				Subscribe
			</a>
			<a
				class="learnMore"
				target="_blank"
				href="https://ltg.com/news/2024/balance-restoration-starts-now">
				Learn more about LIF-coins
			</a>
		</div>
	</BaseModal>
</template>
<script setup lang="ts">
import { IS_LIF_COINS_MODAL_VISIBLE_STATE_KEY } from '@/constants/state-keys';
const isOpened = useState<boolean>(IS_LIF_COINS_MODAL_VISIBLE_STATE_KEY);
const balance = ref(0);

const { $api } = useNuxtApp();

async function getBalance() {
	const { amount } = await $api.getUsersBalance();
	balance.value = amount;
	window.postMessage(
		{
			type: 'refresh-lif-coins-balance',
			amount,
		},
		'*'
	);
}

function close() {
	isOpened.value = false;
}

watch(isOpened, (val) => {
	if (val) {
		getBalance();
	}
});
</script>
<style lang="css" scoped>
.learnMore {
	width: 100%;
	color: rgba(177, 185, 231, 1);
	line-height: 26px;
	font-size: 14px;
	display: block;
	margin-top: 24px;
	text-align: center;
	text-decoration: none;
	transition: all ease 0.25s;
}

.learnMore:hover {
	color: #fff;
}

.learnMore:active {
	color: rgba(127, 139, 201, 1);
}

.buySubscription {
	text-decoration: none;
	color: #000;
	text-transform: uppercase;
	background: rgba(177, 185, 231, 1);
	line-height: 21px;
	height: 50px;
	font-size: 16px;
	font-weight: 700;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	flex: 1 auto;
	transition: all ease 0.25s;
	font-family: 'Pilat Wide', 'Montserrat', Helvetica, Arial, sans-serif;
	margin-top: 24px;
}

.buySubscription:hover {
	background: #fff;
}

.buySubscription:active {
	background: rgba(127, 139, 201, 1);
}

.metaframe-balance {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}

.metaframe-balance > svg:first-child {
	width: 33px;
	height: 29px;
}

.title {
	margin-left: 6px;
}

.title,
.balance {
	font-size: 20px;
	line-height: 24px;
	color: #fff;
	font-weight: 500;
}

.balance {
	margin-left: auto;
	font-weight: 700;
}
</style>
