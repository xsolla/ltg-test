<template>
	<div class="mb-2-S mb-8 rad-3-S rad-10 p-6-M p-10-S p-20 bgWrapper">
		<h1 class="fs-14-M fs-18-S fs-14 fw-6 mb-3-M mb-5-S mb-3-M mb-14">Socials</h1>
		<div>
			<div
				v-for="social in socialNetworks"
				:key="social.name"
				class="d-f jc-b ai-c mb-2-M mb-4-S mb-6">
				<div class="d-f ai-c">
					<div
						class="p-6-S p-15 rad-3-S rad-6 d-f jc-c ai-c mr-2-S mr-4"
						:class="{
							googleBackground: social.background,
							'brs-s br-1': !social.background,
						}">
						<img class="p-a h-2 no-select" :src="social.icon" />
					</div>
					<p class="fs-14-M fs-18-S fs-12 fw-6">{{ social.name }}</p>
				</div>

				<BaseButton
					v-if="social.connection"
					class="w-ab-24-M w-ab-29-S w-ab-50"
					small
					@click="disconnect(social.name)">
					disconnect
				</BaseButton>
				<BaseButton
					v-else
					color="dark"
					class="w-ab-24-M w-ab-29-S w-ab-50"
					small
					@click="connection(social.name)"
					>connect</BaseButton
				>
			</div>
		</div>
	</div>
</template>
<script setup>
import { authTokenCookieKey } from '~/utils/ltg';

const props = defineProps({ socialNetworks: Array });

function setSocialNetworkConnection(value) {
	value?.forEach((elem) => {
		props.socialNetworks.forEach((el) => {
			el.connection = el.name.toLowerCase() === elem.provider.toLowerCase() && !elem.status;
		});
	});
}

// Логин одного из аккаунтов
async function connection(account) {
	const data = await fetch(
		`https://login.xsolla.com/api/users/me/social_providers/${account.toLowerCase()}/login_url?login_url=https://ltg-main-front-stg.ambersoft.llc`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${useCookie(authTokenCookieKey).value}`,
			},
		}
	);
	const res = await data.json();
	window.location.replace(res.url);
}

async function disconnect(account) {
	await fetch(`https://login.xsolla.com/api/users/me/social_providers/${account.toLowerCase()}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${useCookie(authTokenCookieKey).value}`,
		},
	});
	setSocialNetworkConnection([{ provider: account, status: true }]);
}
</script>
