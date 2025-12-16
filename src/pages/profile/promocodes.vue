<script setup>
import PromocodeItem from '@/components/promocode/promocode-item.vue';
import PromocodeInput from '@/components/promocode/promocode-input.vue';

definePageMeta({
	layout: 'profile',
	middleware: ['auth'],
});

const skip = ref(0);
const limit = ref(100);

const loadMoreLoading = ref(false);
const canLoadMore = ref(true);

const { $api } = useNuxtApp();

const { data: promocodes } = useAsyncData(() => $api.getUsersPromocodes(skip.value, limit.value));

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
</script>
<template>
	<div class="profile-content-wrapper">
		<PromocodeInput @promocode-applied="addNewAppliedPromocode" />
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
