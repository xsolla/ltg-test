<script setup>
definePageMeta({
	layout: 'launcher-profile',
});

const route = useRoute();

if (route.query.token) {
	await useSetAuth(route.query.token);
}

const skip = ref(0);
const limit = ref(100);

const loadMoreLoading = ref(false);
const canLoadMore = ref(true);

const { $api } = useNuxtApp();

const { data: promocodes } = useAsyncData(async () => {
	const promocodes = await $api.getUsersPromocodes(skip.value, limit.value);
	for (const promocode of promocodes) {
		const res = await checkPromocodeForDiscount(promocode);
		if (res) promocode.paymentUrl = res;
	}

	return promocodes;
});

const showLoadMoreButton = computed(() => {
	const count = promocodes.value?.length || 0;
	return count && count >= limit.value && canLoadMore.value;
});

function addNewAppliedPromocode(promocode) {
	if (!promocode) {
		return;
	}
	promocodes.value.unshift(promocode);
}

async function loadMore() {
	loadMoreLoading.value = true;
	const newSkip = promocodes.value?.length;
	const newPromocodes = await $api.getUsersPromocodes(newSkip, limit.value);
	if (newPromocodes?.length) {
		promocodes.value.push(...newPromocodes);
	}
	canLoadMore.value = newPromocodes.length < limit.value;
	skip.value = newSkip;
	loadMoreLoading.value = false;
}

async function checkPromocodeForDiscount(promocode) {
	if (promocode.status === 'used') return null;

	if (promocode?.content?.some((i) => i.type !== 'discount_lapi')) {
		return null;
	}

	const currency = useState('currency');
	const tokenPayload = {
		currency: currency.value,
		plan_id: promocode.promocode.pack.game.plan_id,
		type: 'payment',
		slug: promocode.promocode.pack.game.path?.replace(/\//g, ''),
		promocode: promocode.promocode.code,
	};

	if (route.query.to) {
		tokenPayload['return_to'] = route.query.to;
	}

	const data = await $api.getTokenV2(tokenPayload);

	if (!data.token) return null;

	if (data.sandbox_mode) {
		return 'https://sandbox-secure.xsolla.com/paystation4?token=' + data.token;
	}

	return 'https://secure.xsolla.com/paystation4?token=' + data.token;
}

onMounted(() => {
	const user = useState('user');

	if (!user.value) {
		throw createError({ message: 'Page not found', statusCode: 404 });
	}
});
</script>
<template>
	<div class="profile-content-wrapper">
		<PromocodeInput @promocode-applied="addNewAppliedPromocode" :is-launcher="true" />
		<div class="promocodes">
			<PromocodeItem
				:promocode="promocode"
				v-for="promocode in promocodes"
				:key="promocode._id" />
			<button
				v-if="showLoadMoreButton"
				@click="loadMore"
				class="button button--outline button--more">
				<span>{{ $t('promocodes.loadMore') }}</span>
			</button>
		</div>
	</div>
</template>
