<script setup>
import LButton from '~/components/base/v2/l-button.vue';

const props = defineProps({
	subscription: Object,
	game: Object,
	isLast: {
		type: Boolean,
		default: false,
	},
});

const { $api, $i18n } = useNuxtApp();

const showStopSubscriptionModal = ref(false);
const stopSubscriptionLoading = ref(false);
const stopSubscriptionResponseMessage = ref('');

const gameIcon = computed(() => {
	return props.game?.images?.icon || '/icons/lif-mmo.png';
});

const isActive = computed(() => {
	return props.subscription?.status === 'active' && props.subscription.date_next_charge;
});

function closeStopSubscriptionModal() {
	showStopSubscriptionModal.value = false;
}

async function stopSubscription() {
	stopSubscriptionLoading.value = true;
	stopSubscriptionResponseMessage.value = '';
	const sub = props.subscription;
	const data = await $api.stopSubscription(sub.id, { projectId: sub.project_id });

	if (data.ok) {
		stopSubscriptionResponseMessage.value = data.message;
		// eslint-disable-next-line
		props.subscription.status = 'non_renewing';
	} else {
		stopSubscriptionResponseMessage.value =
			data.message?.message || $i18n.t('common.somethingWentWrong');
	}

	setTimeout(() => {
		closeStopSubscriptionModal();
		stopSubscriptionResponseMessage.value = '';
	}, 5000);

	stopSubscriptionLoading.value = false;
}
</script>

<template>
	<div :style="`${isLast ? '' : 'margin-bottom: 20px'}`">
		<div class="d-f fd-c">
			<div class="info-card__row">
				<div class="info-card__pic">
					<img :src="gameIcon" alt="game-subscription-icon" />
				</div>
				<div class="info-card__name subscription-info">
					<h3>{{ game.name }} Subscription</h3>
					<div class="subscription-info__row">
						<p v-if="subscription?.status === 'canceled'">
							{{ $t('subscription.canceled') }}
						</p>
						<p v-else>
							{{ $t('subscription.expirationDate') }}:
							<span class="no-break">{{
								usePrettifyDate(subscription.date_next_charge)
							}}</span>
						</p>
					</div>
				</div>
				<LButton v-if="isActive" @click="showStopSubscriptionModal = true" variant="accent">
					{{ $t('subscription.unsubscribe') }}
				</LButton>
			</div>
		</div>
		<BaseModal
			size="fit-content"
			:is-opened="showStopSubscriptionModal"
			@close="closeStopSubscriptionModal">
			<div>
				<div v-if="!stopSubscriptionResponseMessage">
					<p style="text-align: center; font-size: 1.5rem; margin-bottom: 2rem">
						{{ $t('subscription.confirmUnsubscribe.title') }}
					</p>
					<div class="stop-subscription-buttons">
						<LButton variant="accent" @click="closeStopSubscriptionModal">
							{{ $t('common.close') }}
						</LButton>

						<LButton @click="stopSubscription">
							<BaseLoading v-if="stopSubscriptionLoading" />
							<span v-else>{{ $t('subscription.confirmUnsubscribe.submit') }}</span>
						</LButton>
					</div>
				</div>
				<div v-else style="word-wrap: normal">
					<p style="text-align: center; font-size: 1.5rem; margin-bottom: 2rem">
						{{ stopSubscriptionResponseMessage }}
					</p>
					<div style="display: flex; align-items: center; justify-content: center">
						<LButton
							style="margin-right: 1rem"
							dashed
							small
							@click="closeStopSubscriptionModal"
							>{{ $t('common.close') }}</LButton
						>
					</div>
				</div>
			</div>
		</BaseModal>
	</div>
</template>

<style scoped lang="scss">
@import 'assets/css/variables';

.stop-subscription-buttons {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
}

.subscription-info {
	@media (max-width: $max-mobile) {
		& + button {
			margin-top: 15px;
		}
	}
}
</style>
