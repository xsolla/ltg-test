<script setup>
definePageMeta({
	layout: 'launcher-profile',
});

const route = useRoute();

if (route.query.token) {
	await useSetAuth(route.query.token);
}

const { $api } = useNuxtApp();
const { data: subscriptions } = await useAsyncData(() => $api.getUsersSubscriptions());
const { data: personalInfo } = await useAsyncData(() => $api.getUsersPersonalInfo());

const showConnectLif = ref(false);
const showConfirmMergingAccount = ref(false);

function onMerged(mergedAccount) {
	personalInfo.value.mergedAccounts ??= [];
	personalInfo.value.mergedAccounts.push(mergedAccount);
}

const launcherLink = ref(null);

onMounted(async () => {
	if (
		route.query.action === 'confirm-merge-account' &&
		(route.query.token || route.query['openid.sig'])
	) {
		showConfirmMergingAccount.value = true;
	}

	if (route.query.action === 'open-lif-connect') {
		showConnectLif.value = true;
	}

	launcherLink.value = route.query.to;
});
</script>
<template>
	<div class="w-ab-100">
		<div class="info-card">
			<h2 class="info-card__title">{{ $t('personalInfo.mergeAccount') }}</h2>

			<!-- Merge Legacy LiF Account -->
			<ProfileMergeLifLegacyAccount
				:merged-accounts="personalInfo?.mergedAccounts || []"
				:open-on-mount="showConnectLif"
				:launcher="launcherLink" />

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
				:launcher="launcherLink"
				@merged="onMerged" />
		</div>
	</div>
</template>
