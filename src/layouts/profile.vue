<script setup>
import ProfileSideBar from '@/components/profile/profile-sidebar.vue';
import XsollaModalAuth from '@/components/xsolla-modal-auth.vue';
const showXsollaModalAuth = useState('showXsollaModalAuth');
const user = useState('user').value;
const isLoggedIn = Boolean(user);
</script>
<template>
	<div class="w-ab-100 h-100-S fd-c jc-b-S ai-c page-layout">
		<TheHeaderNew />
		<div v-if="isLoggedIn" class="py-30-S py-80 fd-r-S fd-c ai-t container">
			<ProfileSideBar />
			<NuxtPage />
		</div>
		<div v-else class="profile-error">
			<div class="profile-error__wrapper">
				<span class="profile-error__wrapper-icon">
					<svg
						color="#ef4444"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
					</svg>
				</span>
				<h3>Uh-oh</h3>
				<p style="color: #fef2f2">
					{{ $t('common.haveToLogIn') }}
				</p>
			</div>
		</div>
		<MetaframeBalanceModal />
		<Transition name="layout">
			<ClientOnly>
				<XsollaModalAuth v-if="showXsollaModalAuth" />
			</ClientOnly>
		</Transition>
		<TheFooter class="profile-footer" />
	</div>
</template>
<style lang="css">
.profile-error {
	min-height: 30vh;
	height: min-content;
	width: 100%;
	background-color: var(--darker-color);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: auto;
	margin-bottom: auto;
}

.profile-error__wrapper {
	text-align: center;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: var(--dark-color);
	border-radius: 24px;
	width: 40%;
	padding: 50px 0;
}

@media screen and (max-width: 769px) {
	.profile-error__wrapper {
		width: 90%;
	}
}

.profile-error__wrapper span {
	margin-bottom: 15px;
}

.profile-error__wrapper h3 {
	font-size: 16px;
	font-weight: 500;
	margin-bottom: 10px;
}

.profile-error__wrapper p {
	font-size: 14px;
	opacity: 95%;
}

.profile-error__wrapper-icon {
	width: 32px;
	height: 32px;
	margin-bottom: 15px;
}
</style>
