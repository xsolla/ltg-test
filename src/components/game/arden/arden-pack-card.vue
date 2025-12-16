<script setup lang="ts">
import type { GamePack } from '~/types/arden';
interface Props {
	pack: GamePack;
}
const props = defineProps<Props>();

const emit = defineEmits(['view-more', 'show-paystation']);

function viewMore() {
	emit('view-more');
}

const headerBackground = computed(() => {
	return `background-image: url("${props.pack.headerImage}");`;
});

const canBuy = computed(() => {
	return props.pack.item?.disabled === false;
});

function showPaystation() {
	if (!canBuy.value) return;
	emit('show-paystation');
}
</script>

<template>
	<article class="card-pack" :class="{ 'card-pack--main': pack.isMain }">
		<div class="card-pack__header" :style="headerBackground">
			<span class="card-pack__minor-title">{{ pack.minorTitle }}</span>
			<h3 class="card-pack__title">{{ pack.title }}</h3>
		</div>
		<div class="card-pack__body" :class="{ 'card-pack__body--main': pack.isMain }">
			<div class="card-pack__options">
				<div v-for="(option, index) in pack.options" :key="index" class="card-pack__option">
					<span>{{ option }}</span>
				</div>
				<div class="card-pack__tools">
					<div v-for="(tool, index) in pack.tools" :key="index" class="card-pack__tool">
						<span class="card-pack__tool-name">{{ tool.name }}</span>
					</div>
				</div>
			</div>
			<div v-if="pack.item" class="card-pack__cost">
				<span class="card-pack__old-price" v-if="pack.item.is_discount">
					{{ pack.item.currencySymbol }} {{ pack.item.amount_without_discount }}
				</span>
				<div class="card-pack__price">
					{{ pack.item.currencySymbol }} {{ pack.item.amount }}
				</div>
			</div>
		</div>
		<div class="card-pack__footer">
			<div class="card-pack__buttons">
				<GameArdenButton @click="viewMore" size="small" color="secondary">
					{{ $t('arden-index.pack_content.view') }}
				</GameArdenButton>
				<GameArdenButton
					@click="showPaystation"
					size="small"
					color="primary"
					:disabled="!canBuy">
					{{ $t('arden-index.pack_content.btn_buy') }}
				</GameArdenButton>
			</div>
		</div>
	</article>
</template>

<style lang="scss">
.card-pack {
	display: flex;
	flex-direction: column;
	width: calc((100% / 3) - 30px);
	max-width: 354px;
	min-height: 500px;
	height: auto;
	border-radius: 5px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	background-color: #000;
	overflow: hidden;

	&--main {
		border-color: rgb(255, 168, 0, 0.45);
		zoom: 1.07;

		@media screen and (max-width: 1024px) {
			width: 100%;
			max-width: 450px;
			zoom: 1;
		}
	}

	.card--used {
		//TODO: дописать состояние disabled для кнопки
	}

	@media screen and (max-width: 1024px) {
		width: 100%;
		max-width: 450px;
	}
}

.card-pack__header {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	min-height: 120px;
	padding: 24px 20px;
	box-sizing: border-box;
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-pack__minor-title {
	display: block;
	margin: 0 0 10px;
	font-family: 'Ubuntu', sans-serif;
	font-style: normal;
	font-weight: 500;
	font-size: 12px;
	line-height: 14px;
	text-align: left;
	text-transform: uppercase;
	color: #ffffff;
}

.card-pack__title {
	max-width: 200px;
	margin: 0;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 700;
	font-size: 18px;
	line-height: 100%;
	text-align: left;
	color: #db9909;
}

.card-pack__body {
	position: relative;
	padding: 20px 2em 10px;
	background-image: url(https://cdn.ltg.com/lif/images/cbt/pack-red-shadow.png);

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 3;
		width: 50%;
		height: 100%;
		background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 20%, black 85%);
	}

	&:after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
		width: 50%;
		height: 100%;
		background-size: 100% 100%;
		background-position: 0px 0px;
		background-image: linear-gradient(90deg, #00000000 0%, #000000ff 100%);
	}
}

.card-pack__options {
	list-style: none;
	margin: 0;
	padding: 0;
	text-align: center;
}

.card-pack__option {
	position: relative;
	min-height: 21px;
	padding: 11px 20px;

	span {
		position: relative;
		z-index: 10;
		display: block;
		margin: 0;
		font-family: 'Ubuntu', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 21px;
		text-align: center;
		color: #ffffff;
	}

	&::before {
		content: '';
		position: absolute;
		top: -2px;
		left: 0;
		width: 100%;
		height: 1px;
		background: linear-gradient(90deg, #000000 0%, #373737 49.5%, #000000 100%);
		transform: matrix(-1, 0, 0, 1, 0, 0);
	}

	&:nth-child(even) {
		background-color: #1c1c1c;
		background-image: url('https://cdn.ltg.com/lif/images/cbt/pack-option-bg.png');
		background-size: cover;
		background-position: center top;
		background-repeat: no-repeat;
	}

	&:first-child {
		&:before {
			display: none;
		}

		span {
			display: block;
			color: #ffa800;
			text-shadow:
				0px 0px 10px #ffa800,
				0px 0px 10px #ffa800;
		}
	}

	&:nth-child(2) {
		span {
			color: #ffa800;
			text-shadow:
				0px 0px 10px #ffa800,
				0px 0px 10px #ffa800;
		}
	}

	&:last-child {
		&:after {
			content: '';
			position: absolute;
			bottom: -2px;
			left: 0;
			width: 100%;
			height: 1px;
			background: linear-gradient(90deg, #000000 0%, #373737 49.5%, #000000 100%);
			transform: matrix(-1, 0, 0, 1, 0, 0);
		}
	}
}

.card-pack__tools {
	position: relative;
	min-height: 21px;
	padding: 11px 20px;
	background-color: #1c1c1c;
	background-image: url('https://cdn.ltg.com/lif/images/cbt/pack-option-bg.png');
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;

	&:after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 1px;
		background: linear-gradient(90deg, #000000 0%, #373737 49.5%, #000000 100%);
		transform: matrix(-1, 0, 0, 1, 0, 0);
	}
}

.card-pack__tool {
	line-height: 10px;
}

.card-pack__tool-name {
	position: relative;
	z-index: 10;
	display: inline-block;
	margin: 0;
	font-family: 'Ubuntu', sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 21px;
	text-align: center;
	color: #ffffff;
}

.card-pack__tool {
	&:last-child {
		.card-pack__tool-name {
			display: block;
			color: #ffa800;
			text-shadow:
				0px 0px 10px #ffa800,
				0px 0px 10px #ffa800;
		}
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 3px;
	}
}

.card-pack__footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	min-height: 90px;
	margin-top: auto;
	padding: 16px 20px;
	box-sizing: border-box;
	background-image: url('https://cdn.ltg.com/lif/images/cbt/texture.png');
	background-size: cover;
	background-position: center top;
	background-repeat: no-repeat;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.card-pack__cost {
	padding-top: 10px;
	text-align: left;
}

.card-pack__old-price {
	display: block;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 400;
	font-size: 20px;
	line-height: 26px;
	text-align: left;
	text-decoration-line: line-through;
	color: #919191;
}

.card-pack__price {
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 600;
	font-size: 32px;
	line-height: 34px;
	text-align: center;
	color: #db9909;

	@media screen and (max-width: 480px) {
		font-size: 22px;
		line-height: 26px;
	}
}

.card-pack__buttons {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	width: 100%;

	.arden-button {
		max-width: 153px;
		width: 50%;
		height: 50px;
		padding-left: 10px;
		padding-right: 10px;
		background-color: #000000;
		background-size: 153px 50px;

		&:before,
		&:after {
			background-size: 153px 50px;
		}

		&:hover {
			background-size: 162px 50px;
		}
	}
}

.card-pack__button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 153px;
	height: 50px;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 700;
	font-size: 18px !important;
	line-height: 97.5%;
	text-align: center;
	text-transform: uppercase;
	color: #000000;
	background-color: orange;
}
</style>
