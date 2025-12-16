<template>
	<ModalsAtomsWrapper @close="close">
		<form class="w-ab-100 fd-c ai-c jc-c" @submit.prevent="submit">
			<ModalsAtomsDialog class="w-ab-26-S w-ab-90 rad-10" header-color="grey" @close="close">
				<template #header> {{ title || 'Connect' }} </template>
				<template #body>
					<div class="w-ab-100 fd-c ai-c jc-c my-1">
						<div
							v-if="success && !error"
							class="fs-40-XL fs-20-L fs-14-M fs-16-S fs-18 fw-5 lh-3 px-3 my-3 ta-c">
							Verification was successful
						</div>

						<div
							v-if="error"
							class="fs-40-XL fs-20-L fs-14-M fs-16-S fs-18 fw-5 px-3 my-3-S my-10 ta-c lh-ab-15">
							{{ error }}
						</div>

						<div v-if="!success" class="w-ab-100">
							<div
								v-if="!success"
								class="fs-40-XL fs-20-L fs-14-M fs-16-S fs-18 fw-5 lh-10 px-3 my-3-S my-10 ta-c">
								{{
									codeCheck
										? 'A code has been sent to your email, please enter it.'
										: 'Please, enter your email'
								}}
							</div>

							<div class="w-ab-100 fd-r ai-c jc-c my-2 px-10">
								<!-- <div class="mr-3">{{ codeCheck ? 'Code:' : 'Email:' }}</div> -->

								<Input
									:type="codeCheck ? 'text' : 'email'"
									required
									:placeholder="codeCheck ? 'Code' : 'Email'"
									:clear-value="clear"
									@input="info = $event" />
							</div>
						</div>
					</div>
				</template>
				<template #footer>
					<div class="w-ab-100 fd-r ai-c jc-c">
						<div class="w-ab-30-M w-ab-50-S">
							<Button
								v-if="!success && !error"
								block
								x-small
								submit
								class="py-2-M py-4-S py-8"
								color="dark"
								@submit.prevent="submit"
								>Enter</Button
							>
							<Button
								v-if="success && !error"
								block
								x-small
								class="py-2-M py-4-S py-8"
								color="dark"
								@click="$emit('close')"
								>Exit</Button
							>
							<Button
								v-if="error"
								block
								x-small
								class="py-2-M py-4-S py-8"
								color="dark"
								@click="clearAll"
								>OK</Button
							>
						</div>
					</div>
				</template>
			</ModalsAtomsDialog>
		</form>
	</ModalsAtomsWrapper>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Button from '@/components/Atoms/Button';
import Input from '@/components/Atoms/Input';
export default {
	components: { Input, Button },
	props: {
		title: {
			type: String,
			default: undefined,
		},
		text: {
			type: String,
			default: undefined,
		},
	},
	data: () => ({
		info: undefined,
		codeCheck: false,
		clear: false,
		success: false,
	}),
	computed: {
		...mapState('user', ['error']),
	},
	methods: {
		...mapActions('user', ['setEmail', 'setConfirmEmail']),
		...mapActions('profile', ['isConnectLif']),
		...mapMutations('user', ['setError']),
		close() {
			this.$emit('close');
			document.querySelector('html, body').style.overflow = 'auto';
		},
		async submit() {
			if (!this.codeCheck) {
				this.setEmail(this.info);
				this.codeCheck = true;
				this.clear = true;
			} else {
				await this.setConfirmEmail(this.info);
				this.clear = false;
				this.success = true;
				this.isConnectLif();
			}
		},
		clearAll() {
			this.setError(null);
			this.info = undefined;
			this.codeCheck = false;
			this.success = false;
		},
	},
};
</script>
