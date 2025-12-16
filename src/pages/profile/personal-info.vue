<script setup>
definePageMeta({
	layout: 'profile',
	middleware: ['auth'],
});

const { $api } = useNuxtApp();
const { data: subscriptions } = await useAsyncData(() => $api.getUsersSubscriptions());
const { data: personalInfo } = await useAsyncData(() => $api.getUsersPersonalInfo());

const showConnectLif = ref(false);
const showConfirmMergingAccount = ref(false);

function onMerged(mergedAccount) {
	personalInfo.value.mergedAccounts ??= [];
	personalInfo.value.mergedAccounts.push(mergedAccount);
}

const route = useRoute();

onMounted(() => {
	if (
		route.query.action === 'confirm-merge-account' &&
		(route.query.confirm_token || route.query['openid.sig'])
	) {
		showConfirmMergingAccount.value = true;
	}

	if (route.query.action === 'open-lif-connect') {
		showConnectLif.value = true;
	}
});
</script>
<template>
	<div class="w-ab-100">
		<div class="info-card">
			<h2 class="info-card__title">{{ $t('personalInfo.mergeAccount') }}</h2>

			<!-- Merge Legacy LiF Account -->
			<ProfileMergeLifLegacyAccount
				:merged-accounts="personalInfo?.mergedAccounts || []"
				:open-on-mount="showConnectLif" />

			<!-- Subscriptions list -->
			<ProfileGameSubscription
				v-for="(sub, index) in subscriptions"
				:is-last="index === subscriptions.length - 1"
				:subscription="sub"
				:game="sub.game"
				:key="sub.id" />

			<!-- Confirm Merging Legacy Account -->
			<!-- Shows only if there's action = "confirm-merge-account" and token not null in query -->
			<ProfileConfirmMergeLegacyAccount
				v-if="showConfirmMergingAccount"
				@close="showConfirmMergingAccount = false"
				@merged="onMerged" />
		</div>
	</div>
</template>
