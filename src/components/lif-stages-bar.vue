<script setup>
import IconSymbol from '~/components/icon/symbol.vue';
const { t } = useI18n();

const stages = [
	{
		order: 1,
		header: t('arden-index.stage_title_1'),
		text: '',
		status: 'done', // статусы связанные с классами done и , либо пустота
	},
	{
		order: 2,
		header: t('arden-index.stage_title_2'),
		text: '',
		status: 'done',
	},
	{
		order: 3,
		header: t('arden-index.stage_title_3'),
		text: '',
		status: 'actual',
	},
];
</script>

<template>
	<div class="progress-bar">
		<ul class="progress-bar__list">
			<li
				v-for="stage in stages"
				:key="stage.order"
				:class="['progress-bar__item', stage.status]">
				<div class="progress-point"></div>
				<span class="progress-bar__icon">
					<IconSymbol />
				</span>
				<div class="progress-bar__order">{{ stage.order }}</div>
				<div class="progress-bar__header">{{ stage.header }}</div>
				<p class="progress-bar__text">{{ stage.text }}</p>
			</li>
		</ul>
	</div>
</template>

<style scoped lang="scss">
.progress-bar {
	max-width: 1320px;
	padding: 0 5vw;
	margin: 0 auto;

	@media screen and (max-width: 768px) {
		padding: 0;
	}
}

.progress-bar__list {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 30px;

	@media screen and (max-width: 768px) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		max-width: calc(100% - 1vw);
		margin: 0 auto;
		padding-top: 60px;
	}

	@media screen and (max-width: 480px) {
		max-width: 100%;
	}
}

.progress-bar__item {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	min-width: 200px;
	white-space: nowrap;

	&::before {
		content: '';
		position: absolute;
		z-index: -1;
		top: 16px;
		right: 33%;
		width: 270px;
		height: 1px;
		background-color: #fff;

		@media screen and (max-width: 768px) {
			display: none;
		}
	}

	&:after {
		display: none;
		content: '';
		position: absolute;
		z-index: -1;
		top: 38px;
		right: unset;
		left: 20px;
		width: 1px;
		height: calc(100% + 30px);
		background-color: #fff;

		@media screen and (max-width: 768px) {
			display: block;
		}
	}

	&.done {
		.progress-bar__order {
			color: #d90000;
		}

		.progress-bar__icon {
			svg {
				width: 100%;
				fill: #d90000;
			}
		}

		&::before {
			background-color: #d90000;

			@media screen and (max-width: 768px) {
				left: 20px;
			}
		}

		&::after {
			background-color: #d90000;

			@media screen and (max-width: 768px) {
				background: linear-gradient(0deg, #ffffff 0%, rgb(168, 65, 65) 47%);
			}
		}

		&:first-child {
			&::before {
				background: linear-gradient(90deg, #d90000 0%, rgba(247, 0, 0, 0) 100%);
				transform: matrix(-1, 0, 0, 1, 0, 0);

				@media screen and (max-width: 768px) {
					left: 20px;
					height: 100px;
					background: linear-gradient(0deg, #d90000 0%, rgba(247, 0, 0, 0) 100%);
				}
			}
		}

		&:last-child {
			&::after {
				background: linear-gradient(-90deg, #d90000 0%, rgba(247, 0, 0, 0) 100%);
				transform: matrix(-1, 0, 0, 1, 0, 0);

				@media screen and (max-width: 768px) {
					left: 20px;
					background: linear-gradient(180deg, #d90000 0%, rgba(247, 0, 0, 0) 100%);
				}
			}
		}
	}

	&.actual {
		&::before {
			background-color: #d90000;
		}

		.progress-bar__order {
			color: #db9909;
		}

		.progress-bar__icon {
			width: 34px;
			height: 34px;
			margin-bottom: 8px;

			svg {
				width: 100%;
				fill: #db9909;
			}

			@media screen and (max-width: 768px) {
				left: 4px;
			}
		}
	}

	&:not(.actual) {
		.progress-bar__icon {
			transform: translateY(4px);
		}
	}

	&:first-child {
		&:before {
			content: '';
			width: 190px;
			background: linear-gradient(90deg, #ffffff 0%, rgba(247, 0, 0, 0) 100%);
			transform: matrix(-1, 0, 0, 1, 0, 0);

			@media screen and (max-width: 768px) {
				top: -40px;
				left: 20px;
				display: block;
				width: 1px;
				height: 100%;
			}
		}

		&.actual {
			&:before {
				content: '';
				width: 190px;
				background: linear-gradient(90deg, #d90000 0%, rgba(247, 0, 0, 0) 100%);
				transform: matrix(-1, 0, 0, 1, 0, 0);
			}
		}
	}

	&:last-child {
		&:after {
			content: '';
			position: absolute;
			z-index: -1;
			top: 16px;
			left: 45%;
			display: block;
			width: 190px;
			height: 1px;
			background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);

			@media screen and (max-width: 768px) {
				top: 30px;
				left: 20px;
				width: 1px;
				height: 100%;
				display: block;
				background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
			}
		}
	}

	@media screen and (max-width: 768px) {
		padding-left: 58px;
	}

	&.progress {
		&:before {
			background: linear-gradient(87deg, #ffffff 11%, rgb(217, 0, 0) 40%);
			transform: matrix(-1, 0, 0, 1, 0, 0);

			@media screen and (max-width: 768px) {
				background: linear-gradient(0deg, #ffffff -40%, rgb(168, 65, 65) 100%);
			}
		}

		.progress-point {
			position: absolute;
			top: 8px;
			left: -20px;

			&:after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 18px;
				height: 18px;
				border-radius: 50%;
				background: #d90000;
			}

			@media screen and (max-width: 768px) {
				left: 12px;
				top: -16px;
			}
		}
	}
}

.progress-bar__icon {
	display: inline-block;
	width: 24px;
	height: 24px;
	margin: 0 auto 18px;
	text-align: center;
	background-color: #0c0e0d;

	svg {
		width: 100%;
		height: 100%;
		fill: #ffffff;
	}

	@media screen and (max-width: 768px) {
		position: absolute;
		top: 30px;
		left: 8px;
		z-index: 10;
	}
}

.progress-bar__order {
	margin: 0 auto 12px;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 700;
	font-size: 20px;
	line-height: 22px;
	text-align: center;
	text-transform: uppercase;
	color: #ffffff;

	@media screen and (max-width: 768px) {
		margin: 0 0 12px;
		text-align: left;
	}
}

.progress-bar__header {
	position: relative;
	height: 30px;
	min-width: 140px;
	padding: 8px 0;
	margin: 0 auto 13px;
	font-family: 'Goudy Trajan', serif;
	font-style: normal;
	font-weight: 700;
	font-size: 14px;
	line-height: 15px;
	text-align: center;
	text-transform: uppercase;
	color: #ffc148;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 1px;
		width: 100%;
		min-width: 140px;
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			#cacaca 50.5%,
			rgba(153, 153, 153, 0) 100%
		);
	}

	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		height: 1px;
		width: 100%;
		min-width: 140px;
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			#cacaca 50.5%,
			rgba(153, 153, 153, 0) 100%
		);
	}

	@media screen and (max-width: 768px) {
		min-width: auto;
		margin: 0 0 13px;
		text-align: left;
	}
}

.progress-bar__text {
	max-width: 196px;
	margin: 0 auto;
	font-family: 'Ubuntu', sans-serif;
	font-style: normal;
	font-weight: 300;
	font-size: 16px;
	line-height: 20px;
	text-align: center;
	color: #ffffff;

	@media screen and (max-width: 768px) {
		width: 100%;
		max-width: 90%;
		margin: 0;
		text-align: left;
	}
}
</style>
