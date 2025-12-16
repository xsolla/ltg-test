<script setup>
import BaseButton from '@/components/base/base-button.vue';
function setUserIsBan() {}

const userBan = useState('userBan');
</script>

<template>
	<div v-if="userBan" class="p-f t-0 l-0 w-ab-100 h-ab-100 fd-c jc-c ai-c z-50">
		<div class="p-a t-0 l-0 w-ab-100 h-ab-100 background" />

		<div class="w-ab-35-S h-ab-30-S w-ab-80 h-ab-30 fd-c jc-c ai-c p-f">
			<div class="w-ab-100 h-ab-100 fd-c jc-c ai-c p-2-S p-5 bg modal-wrapper">
				<h1>User Ban Confirmation</h1>
				<div class="modal-content">
					<p>{{ userBan.description }}</p>

					<p v-if="!userBan.permanent">
						<strong> You are blocked until: </strong>
						<span style="font-weight: 700"> {{ userBan.dateTo }} </span>
					</p>
					<p v-else style="color: brown; font-weight: 600">You are blocked permanently</p>
				</div>

				<div v-if="false" class="modal-errors">
					<p>You have to select at least something</p>
					<p>You have to stop making mistakes</p>
				</div>
				<div class="d-f jc-b">
					<BaseButton color="modal" @click="setUserIsBan">Ok</BaseButton>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.background {
	background: rgba(18, 15, 44, 0.9);
}
.bg {
	background: #201c46;
	border-radius: 15px;
}
.modal-wrapper {
	padding: 30px;
	height: auto;
	text-align: left;
}
.modal-wrapper h1 {
	font-family: 'Montserrat';
	font-style: normal;
	font-weight: 700;
	font-size: 18px;
	line-height: 22px;
	color: #ffffff;
	width: 100%;
	margin-bottom: 20px;
}
.modal-wrapper .modal-content {
	font-family: 'Montserrat';
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 24px;
	color: rgba(255, 255, 255, 0.75);
	margin-bottom: 30px;
	width: 100%;
}
.modal-wrapper .modal-checkboxes {
	font-family: 'Montserrat';
	font-style: normal;
	font-weight: 500;
	font-size: 13px;
	line-height: 16px;
	color: #8576fd;
	width: 100%;
	margin-bottom: 15px;
}
.modal-wrapper .modal-checkboxes .row {
	width: 100%;
	margin-bottom: 15px;
}
.modal-wrapper .modal-checkboxes .row a {
	text-decoration: underline;
}
.modal-wrapper .modal-checkboxes .row label {
	display: grid;
	grid-template-columns: 1em auto;
	gap: 1.5em;
}

.modal-wrapper .modal-checkboxes .row input[type='checkbox'] {
	/* Add if not using autoprefixer */
	-webkit-appearance: none;
	/* Remove most all native input styles */
	appearance: none;
	margin: 0;
	width: 24px;
	height: 24px;

	background: #120f2c;
	border: 1px solid #302d53;
	border-radius: 4px;
	position: relative;
}

.modal-wrapper .modal-checkboxes .row input[type='checkbox']::before {
	content: '';
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
}

.modal-wrapper .modal-checkboxes .row input[type='checkbox']:checked::before {
	background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNiAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMzMzMzMgMTMuNUwwIDguMTgyMzVMMi4zNzE2NyA1LjgxNzY1TDUuMzMzMzMgOC43Nzg5NkwxMy42MjgzIDAuNUwxNiAyLjg2NDdMNS4zMzMzMyAxMy41WiIgZmlsbD0iIzg1NzZGRCIvPgo8L3N2Zz4K);
	background-repeat: no-repeat;
	background-position: center;
}

.modal-wrapper .modal-checkboxes .row input[type='checkbox']:focus {
	outline: 0;
	outline-offset: 0;
	background: #120f2c;
	border: 1px solid #302d53;
}
.modal-wrapper .modal-errors {
	width: 100%;
	font-family: 'Montserrat';
	font-style: normal;
	font-weight: 500;
	font-size: 12px;
	line-height: 24px;
	color: rgba(255, 0, 0, 0.75);
	padding-bottom: 30px;
	display: none;
}
</style>
