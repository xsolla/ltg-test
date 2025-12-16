<template>
	<div class="custom-select">
		<select
			:value="value"
			@input="$emit('input', $event.target.value)"
			class="w-full bg-darker cursor-pointer appearance-none focus:outline-none outline-none py-2.5">
			<option value="">Select</option>
			<option
				v-for="option in options"
				:value="trackBy ? option[trackBy] : option"
				:key="trackBy ? option[trackBy] : option"
				class="text-lg capitalize">
				{{ showBy ? option[showBy] : option }}
			</option>
		</select>
		<span
			class="absolute h-full flex items-center justify-center right-0 top-0 bottom-0 w-min mr-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-4 h-4 text-white/70 stroke-current">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
			</svg>
		</span>
	</div>
</template>
<script>
export default {
	name: 'gift-modal',
	props: {
		name: {
			type: String | Number,
			default: '',
		},
		time: {
			type: String,
			default: '',
		},
		cost: {
			type: String,
			default: '',
		},
	},
};
</script>
