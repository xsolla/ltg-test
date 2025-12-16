<template>
	<button class="metaframe-balance" @click="sendEvent">
		<IconSickle width="24" height="24" class="metaframe-balance-icon" />
		<span class="balance">
			{{ balance.amount }}
		</span>
	</button>
</template>
<script setup lang="ts">
import { logPostMessage } from '@/utils/postmessage-logger';

definePageMeta({
	layout: 'metaframe',
});
const { $api, $f9 } = useNuxtApp();

const balance = ref<{ amount: number }>({ amount: 0 })

function sendEvent() {
	window.parent.postMessage(
		{
			type: '@metaframe-partner-events:mini-app-menu-button-clicked:Balance',
		},
		'*'
	);
}

async function getBalance() {
	const route = useRoute();
	const metaframeAccessToken = route.query.metaframeAccessToken;
	if (!metaframeAccessToken) return;


	const config = useRuntimeConfig().public
	const { token } = await $api.exchangeBabkaToken(metaframeAccessToken.toString(), config.LOGIN_PROJECT_ID)
	if (!token) return;

	$f9.setAuthorization(`Bearer ${token}`);

	balance.value = await $api.getUsersBalance()
}

onMounted(() => {
	getBalance()
	window.addEventListener('message', (e) => {
		logPostMessage(e, 'LIF Coins Balance');
		if (e.data == null || typeof e.data !== 'object') return;

		const { type, amount } = e.data
		if(type === 'refresh-lif-coins-balance' && typeof amount === 'number') {
			balance.value = {
				amount
			}
		}
	})
})
</script>
<style scoped lang="css">
.metaframe-balance {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 48px;
	width: 48px;
	color: white;
	background: transparent;
	position: relative;
}

.metaframe-balance-icon {
	margin-top: 2px;
}

.balance {
	font-size: 10px;
	font-weight: bold;
	color: inherit;
	margin-top: 2px;
	margin-right: 2px;
	text-align: left;
	position: absolute;
	top:0;
	right: 0;
}
</style>
