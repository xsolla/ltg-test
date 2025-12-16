<template>
	<Teleport to="body">
		<div class="popup popup--pack">
			<div class="popup__overlay" @click="closePopup"></div>
			<div class="popup__slide-wrapper">
				<button
					class="popup-slide__arrow popup-slide__arrow--prev"
					@click="prevPack"
					:disabled="isFirst">
					<IconArdenArrowSlider />
				</button>

				<div class="popup__dialog">
					<button class="popup__close" @click="closePopup" aria-label="close popup">
						<IconUiKitClose class="menu-trigger__close" />
					</button>
					<div
						class="popup__header"
						:style="headerBackground"
						:class="{ 'popup__header--main': pack.isMain }">
						<span class="card-pack__minor-title">{{ pack.minorTitle }}</span>
						<h3 class="card-pack__title">{{ pack.title }}</h3>
					</div>
					<div class="popup__body" :class="{ 'popup__body--main': pack.isMain }">
						<div class="wrapper">
							<div class="card-pack__options">
								<div
									v-for="(option, index) in pack.options"
									:key="index"
									class="card-pack__option">
									<span>{{ option }}</span>
								</div>
								<div class="card-pack__tools">
									<div
										v-for="(tool, index) in pack.tools"
										:key="index"
										class="card-pack__tool">
										<img
											:src="tool.image"
											:alt="tool.name"
											class="card-pack__tool-image" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="popup__footer">
						<div v-if="pack.item" class="card-pack__cost">
							<span class="card-pack__old-price" v-if="pack.item.is_discount">
								{{ pack.item.currencySymbol }}
								{{ pack.item.amount_without_discount }}
							</span>
							<div class="card-pack__price">
								{{ pack.item.currencySymbol }} {{ pack.item.amount }}
							</div>
						</div>
						<div class="popup__button">
							<GameArdenButton
								size="small"
								color="primary"
								:disabled="!canBuy"
								@click="showPaystation">
								{{ $t('arden-index.pack_content.btn_buy') }}
							</GameArdenButton>
						</div>
					</div>
				</div>

				<button
					class="popup-slide__arrow popup-slide__arrow--next"
					@click="nextPack"
					:disabled="isLast">
					<IconArdenArrowSlider />
				</button>
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import type { GamePack } from '~/types/arden';
import { IconArdenArrowSlider } from '#components';
const props = defineProps<{
	pack: GamePack;
	isFirst: boolean;
	isLast: boolean;
}>();

const emit = defineEmits(['close', 'show-paystation', 'next-pack', 'prev-pack']);

function closePopup() {
	emit('close');
}

function showPaystation() {
	if (!canBuy.value) return;
	emit('show-paystation');
}

const canBuy = computed(() => {
	return props.pack.item?.disabled === false;
});

function nextPack() {
	emit('next-pack');
}

function prevPack() {
	emit('prev-pack');
}

const headerBackground = computed(() => {
	return `background-image: url("${props.pack.headerImage}");`;
});

function escapeHandler({ key }: KeyboardEvent) {
	if (key === 'Escape') emit('close');
}

onMounted(() => {
	document.addEventListener('keydown', escapeHandler);
});

onUnmounted(() => {
	document.removeEventListener('keydown', escapeHandler);
});
</script>
<style lang="scss" scoped>
/* popup */
.popup {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9996;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	.popup__body-wrapper {
		width: 100% !important;
		height: 100% !important;
	}

	&--pack {
		.popup__dialog {
			width: 100%;
			max-width: 540px;
			height: 90vh;
			max-height: 740px;
		}

		.popup__body {
			height: calc(100% - 102px - 86px);
			padding: 0;
			overflow: auto;

			&--main {
				height: calc(100% - 140px - 86px);
			}
		}

		.card-pack__tool-name {
			display: block;
			margin: 0 auto 10px;
			text-align: center;
		}

		.card-pack__tools {
			background-color: #000000;
			background-image: none;
		}

		.card-pack__tool {
			margin-bottom: 30px;

			&:last-child {
				margin-bottom: 10px;
			}
		}

		.popup__header {
			flex-direction: column;
			align-items: flex-start;
			padding: 0 20px;
			background-image: none;
		}

		.popup__footer {
			justify-content: space-between;
		}

		.card-pack__tool-name,
		.card-pack__option span {
			color: #ffffff;
			text-shadow: none;
		}

		.lif-button {
			min-width: 135px;

			&:before,
			&:after {
				background-size: 136px 46px;
			}
		}

		.popup__slide-wrapper {
			@media screen and (max-width: 480px) {
				max-width: 300px;
			}
		}
	}

	&--codes {
		.popup__dialog {
			width: 100%;
			max-width: 800px;
			height: 70vh;
			max-height: 530px;
		}

		.popup__body {
			height: calc(100% - 100px - 86px);
		}

		.popup__footer {
			justify-content: center;
		}
	}

	.lif-button {
		width: 136px;
		height: 46px;
		background-size: 136px 46px;
		background-color: #000000;

		@media screen and (max-width: 480px) {
			width: 95px;
		}
	}

	@media screen and (max-width: 768px) {
		padding: 0 20px;
	}
}

.popup__scroll {
	padding: 50px 45px 45px 45px;
	margin: 0;
	overflow-y: unset;
	height: 100%;
	max-height: 542px;

	@media screen and (max-width: 768px) {
		padding: 20px 16px 32px 16px;
	}
}

.popup__overlay {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9996;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.9);
}

.popup__dialog {
	position: relative;
	z-index: 9997;
	width: 100%;
	max-width: 540px;
	background-color: #000000;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 5px;
	overflow: hidden;
}

.popup__header {
	position: relative;
	min-height: 108px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px 5px 0 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	overflow: hidden;
	background-image: url('https://cdn.ltg.com/lif/images/16/popup-header-bg.png'),
		url('https://cdn.ltg.com/lif/images/16/popup-header-decor-left_2.png'),
		url('https://cdn.ltg.com/lif/images/16/popup-header-decor-right_2.png');
	background-repeat: no-repeat;
	background-size:
		cover,
		90px 135px,
		90px 135px;
	background-position:
		center top,
		top 20px left 125px,
		top 20px right 125px;

	h2 {
		position: relative;
		z-index: 5;
		width: 100%;
		min-width: 220px;
		max-width: 255px;
		margin: 0;
		font-family: 'Ubuntu', sans-serif;
		font-style: normal;
		font-weight: 400;
		font-size: 28px;
		line-height: 28px;
		text-align: center;
		color: #db9909;
	}

	&--main {
		min-height: 140px;
	}
}

.popup__close {
	position: absolute;
	top: 0;
	right: 0;
	left: unset;
	z-index: 100;
	width: 30px;
	height: 30px;
	border-radius: 0 7px 0 7px;
	background: #000000;
	border: none;
	cursor: pointer;

	svg {
		width: 14px;
		height: 14px;
		fill: #fff;
		transition: fill linear 0.2s;

		path {
			fill: #fff;
			transition: fill linear 0.2s;
		}
	}

	&:hover {
		svg {
			fill: #db9909;
		}
	}
}

.popup__footer {
	position: relative;
	min-height: 80px;
	display: flex;
	align-items: center;
	padding: 0 20px;
	border-radius: 0 0 5px 5px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	background-image: url('https://cdn.ltg.com/lif/images/16/popup-header-bg.png');
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center top;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-size: cover;
	}
}

.popup__body {
	padding: 50px 45px 45px 45px;
	overflow: auto;

	p {
		margin: 0 auto 40px;
		font-family: 'Ubuntu', sans-serif;
		font-style: normal;
		font-weight: 300;
		font-size: 16px;
		line-height: 26px;
		color: #ffffff;
	}

	@media screen and (max-width: 768px) {
		padding: 20px 35px 20px 35px;
	}
}

.popup__button {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px;
}

.popup__slide-wrapper {
	position: relative;
	width: 100%;
	max-width: 540px;
	height: 90vh;
	max-height: 740px;
}

.popup-slide__arrow {
	position: absolute;
	top: 50%;
	z-index: 9999;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70px;
	height: 100px;
	cursor: pointer;
	background: transparent;
	border: none;

	@media screen and (max-width: 480px) {
		width: 30px;
	}

	svg {
		fill: #ffc148;
	}

	&--prev {
		left: -70px;

		@media screen and (max-width: 480px) {
			left: -30px;
		}
	}

	&--next {
		right: -70px;

		@media screen and (max-width: 480px) {
			right: -30px;
		}

		svg {
			transform: rotate(180deg);
		}
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
}
</style>
