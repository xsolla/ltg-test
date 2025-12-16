<script setup lang="ts">
import MenuElement from '~/components/menu-element.vue';
import { defineEmits } from 'vue';
import type { MenuItem } from '~/types';
import LangDropdown from '~/components/lang-dropdown.vue';
import LangDropdownCollapse from '~/components/lang-dropdown-collapse.vue';
import CloseIcon from '~/components/icon/ui-kit/close.vue';
import BurgerIcon from '~/components/icon/ui-kit/burger.vue';
import ProfileDropdown from '~/components/menu/profile-dropdown.vue';

const user = useState('user');

type Emits = {
	(e: 'close-click'): void;
};

type Props = {
	elements: MenuItem[];
};

const emit = defineEmits<Emits>();
defineProps<Props>();

const hasCBTAccess = useState<boolean>('has-cbt-access'); // Initialize hasCBTAccess

const checkCBTAccess = async () => {
	// Кнопка CBT доступна только для авторизованных пользователей.
	if (!user.value) {
		hasCBTAccess.value = false;
		return;
	}
	hasCBTAccess.value = true;
	return;
};

watch(user, () => {
	checkCBTAccess();
});

onMounted(() => {
	checkCBTAccess(); // Check access on component mount
});
</script>

<template>
	<div class="device-menu ">
		<div class="device-menu__header container">
			<NuxtLink to="/" class="header-logo logo">
				<img src="public/logo/logo.svg" alt="Logo" />
			</NuxtLink>

			<a
				v-if="hasCBTAccess"
				:data-pixel="`clicktocbtpage`"
				href="/game/life-is-feudal-arden/thank-you"
				class="btn-cbt-page"
			>
				<span>{{ `Arden Info` }}</span>
			</a>

			<button class="device-menu__toggle cr-p">
				<CloseIcon class="close-icon" @click="emit('close-click')"/>
			</button>

		</div>
		<div class="device-menu__body">
			<ul class="device-menu__list item-list">
				<MenuElement
					v-for="(item, i) of elements"
					:key="i"
					source="header"
					variant="header"
					:item="item" />
			</ul>
			<div class="mobile-menu-lang device-menu__langs">
<!--				<LangDropdown />-->
				<LangDropdownCollapse/>
			</div>
			<div class="login-mobile">
				<ProfileDropdown v-if="user" class="header__profile-dropdown"/>
			</div>

		</div>
	</div>
</template>

<style lang="scss" scoped>

.container {
	background: var(--reskin-primary-dark-color);

	& > .logo-container {
		padding: 1vw 20px;

		@media (max-width: 768px) {
			padding: 3.75vw 20px;
		}
	}
}

.device-menu {
	width: 100%;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	z-index: 9999;
	background-color: #494f86;
}

.device-menu__toggle {
	margin-left: 16px;
	height: 16px;
	width: 20px;
	align-self: center;
}

.logo {
	margin: 0;

	@media screen and (max-width: 768px){
		margin-right: 10px;
	}

	img {
		width: 71px;
		height: 56px;

		@media screen and (max-width: 1024px) {
			width: 54px;
			height: 44px;
		}

		@media screen and (max-width: 768px) {
			width: 54px;
			height: 34px;
		}

		@media screen and (max-width: 480px) {
			width: 39px;
			height: 30px;
		}
	}
}

.btn-cbt-page {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 156px;
	height: 61px;
	padding: 20px 24px;
	margin-right: 10px;
	border-radius: 0 !important;
	opacity: 1;
	cursor: pointer;
	background: #b0baee;

	span {
		position: relative;
		z-index: 3;
		color: #0d143a;
		font-family: "Pilat Wide", "Montserrat", sans-serif;
		font-size: 16px;
		font-weight: 700;
		font-style: normal;
		text-transform: uppercase;
		text-align: center;
		white-space: nowrap;
	}

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		opacity: 0;
		background: linear-gradient(#aea0ff, #ffa5eb);
		transition: opacity ease 0.25s;
	}

	&:hover::before {
		opacity: 1;
	}
}

.device-menu__list {
	position: relative;
	max-width: 80%;
	margin: 2vw auto;
	padding-bottom: 30px;

	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		height: 1px;
		width: 185px;
		background-color: rgba(255, 255, 255, 0.18);
	}

	li {
		display: flex;
		justify-content: center;
		text-align: center;
	}

	.menu-item-list {
		@media (max-width: 1024px) {
			right: unset!important;
			left: -80%!important;
			z-index: 9999;
		}

	}
}

.device-menu__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1vw 20px;
	width: 100%;
	height: 78px;


	@media screen and (max-width: 1024px){
		height: 75px;
		padding: 15px 20px;
	}

	@media screen and (max-width: 768px){
		height: 58px;
		padding: 15px 20px;
	}

	.btn-cbt-page {
		margin: 0 auto;

		@media screen and (max-width: 768px) {
			display: flex;
			align-items: center;
			width: 139px;
			padding: 0;
			height: 32px;
			line-height: 29px;
		}
	}
}

.device-menu__body {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-grow: 2;
	height: calc(100vh - 90px);
}

.device-menu__langs {
	display: flex;
	justify-content: center;
	padding-top: 4px;
	width: 140px;
}

.login-mobile {
	margin-top: 30px;
}

</style>
