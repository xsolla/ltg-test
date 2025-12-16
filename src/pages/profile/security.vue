<script setup>
import useMobileTablet from '@/composables/mobile-tablet-desktop';
</script>

<template>
	<div class="bgWrapper mb-ab-20 rad-3-S rad-10 p-6-M p-10-S p-20">
		<div class="mb-2-M mb-6-S mb-12">
			<h2 class="mb-1-M mb-3-S mb-6 fs-18-M fs-12-S fs-14 fw-6">Username</h2>
			<div class="fd-r-S fd-c jc-b ai-c p-r">
				<input
					v-model="form.userName"
					placeholder="User name"
					type="text"
					maxlength="32"
					:class="{ inputError: error.name }"
					class="bg-main-300 px-12 px-8-S px-4-M py-2-M py-4-S py-8 rad-3-S rad-50 w-ab-60-S w-ab-100 f-main-600 fs-14-M fs-16-S fs-18 lh-20 fw-5 input mb-0-S mb-4" />

				<img v-if="mobile" src="/icons/edit.svg" class="p-a t-3 r-5" />
				<BaseButton
					v-if="!changeName"
					color="dark"
					class="w-ab-30-S w-ab-100 py-2-M py-4-S py-8"
					small
					@click="changedName">
					Change
				</BaseButton>
				<BaseButton
					v-else
					class="w-ab-30-S w-ab-100 py-2-M py-4-S py-8"
					@click="saveUserName()"
					>Save</BaseButton
				>
			</div>
			<div v-if="error.name" class="ta-c w-ab-60-S fs-14-M fs-16-S fs-18 mt-1 error">
				{{ error.nameText }}
			</div>
			<div v-if="approved" class="ta-c w-ab-60-S fs-14-M fs-16-S fs-18 mt-1 green">
				Your user name is changed
			</div>
		</div>
	</div>
</template>

<script>
import BaseButton from '@/components/base/base-button.vue';
const { mobile } = useMobileTablet();
const config = useRuntimeConfig();

export default {
	name: 'Security',
	components: { BaseButton },
	layout: 'profile',
	data() {
		return {
			form: {
				userName: '',
				password: '',
				oldPassword: '',
				newPassword: '',
				replaceNewPassword: '',
			},
			approved: false,
			error: {
				status: 0,
				passwordText: 'Password is too short',
				passwordText1: 'the old password does not match',
				passwordText2: 'the new password does not match',
				passwordText3: 'New password is too short',
				name: false,
				nameText: 'Name is too short',
			},
			changePassword: false,
			changeName: false,
			passwordFieldType: 'password',
		};
	},
	methods: {
		saveUserName() {
			if (this.form.userName.length > 3) {
				this.changeUserName({ username: this.form.userName });
				this.changeName = false;
				this.form.userName = '';
				this.approved = true;
			} else {
				this.changedName();
				this.changeName = false;
			}
		},
		switchVisibility() {
			this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
		},

		changedPassword() {
			if (
				this.form.password.length > 5 &&
				this.form.password === this.form.oldPassword &&
				this.form.newPassword === this.form.replaceNewPassword
			) {
				this.changePassword = true;
			} else if (this.form.password.length < 5) {
				this.error.status = 1;
			} else if (this.form.password !== this.form.oldPassword) {
				this.error.status = 2;
			} else if (
				this.form.newPassword === this.form.replaceNewPassword &&
				this.form.newPassword > 5
			) {
				this.error.status = 3;
			} else if (this.form.newPassword < 5) {
				this.error.status = 4;
			}
		},

		async changeUserName(value) {
			const xsollaToken = useCookie(authTokenCookieKey).value;
			await fetch(`${config.public.LTG_API}/user/set-username?authToken=${xsollaToken}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(value),
			});
		},

		changedName() {
			if (this.form.userName.length > 3) {
				this.changeName = true;
				this.error.name = false;
				this.approved = false;
			} else {
				this.approved = false;
				this.error.name = true;
			}
		},
		save() {
			this.changeProfilePassword(this.form);
		},
	},
};
</script>

<style scoped lang="scss">
.bgWrapper {
	background: var(--medium-darker-color);
}
.input {
	border: 1px solid #302d53;
	outline: none;
	&:focus {
		border: 1px solid var(--main-color);
		transition: all 400ms ease-in-out;
	}
}
.inputError {
	border: 1px solid #a53831 !important;
}
.error {
	color: #a53831;
}
.green {
	color: #4ab929;
}
</style>
