<template>
	<div>
		<BaseLabel v-if="label" :label="label" />
		<input
			class="form-input"
			:value="modelValue"
			@input="onInput"
			@keyup.enter="onEnter"
			:placeholder="placeholder"
			ref="input"
			:name="name"
			:type="type"
			:required="required"
			:disabled="disabled || loading" />
	</div>
</template>
<script setup lang="ts">
const props = defineProps({
	modelValue: [String, Number],
	placeholder: {
		type: String,
		default: null,
	},
	type: {
		type: String,
		default: 'text',
	},
	required: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: null,
	},
	name: String,
	focusOnMount: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue', 'on-enter']);

function onInput(event: Event) {
	emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function onEnter(event: Event) {
	emit('on-enter');
}

const input = ref<HTMLElement | null>(null);

onMounted(() => {
	if (props.focusOnMount) {
		input.value?.focus();
	}
});
</script>
<style lang="scss" scoped>
.form-input {
	width: 100%;
	padding: 12px 15px;
	border-radius: 5px;
	outline: none;
	border: 1px solid #2e2a4d;
	background: #1a1736;
	color: #fff;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;

	& + .modal-form__message {
		padding-top: 5px;
	}

	&:focus,
	&:active {
		border-color: #2e2a4d;
		outline: none;
	}
}
</style>
