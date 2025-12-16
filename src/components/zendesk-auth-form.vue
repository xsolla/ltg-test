<script setup lang="ts">
import { ref } from 'vue';
import { useRuntimeConfig, useCookie, navigateTo } from 'nuxt/app';
import { ZENDESK_SESSION_COOKIE_KEY } from '~/constants/cookie-keys';
import { HELP_CENTER_LINK } from '~/constants/common';

const config = useRuntimeConfig();
const zendeskSSOUrl = `${config.public.ZENDESK_URI}/access/jwt`;

const zendeskSession = ref('');

const onFormSubmit = async (e: Event) => {
	const sessionCookie = useCookie(ZENDESK_SESSION_COOKIE_KEY);

	if (!sessionCookie.value) {
		e.preventDefault();

		await navigateTo(HELP_CENTER_LINK, {
			external: true,
			open: {
				target: '_blank',
			},
		});

		return;
	}

	zendeskSession.value = sessionCookie.value;
	sessionCookie.value = null;
};
</script>

<template>
	<form
		target="_blank"
		:class="$style.form"
		method="post"
		@submit="onFormSubmit"
		:action="zendeskSSOUrl">
		<input name="jwt" :value="zendeskSession" type="hidden" />
		<slot />
	</form>
</template>

<style module lang="scss">
.form {
	display: inline-block;
}
</style>
