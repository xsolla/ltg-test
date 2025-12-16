<script setup lang="ts">
import Link from '@/components/base/link.vue';
const props = defineProps<{ isLauncher?: boolean }>();
const { $i18n } = useNuxtApp();
let routePrefix = '';

if (props.isLauncher) {
	routePrefix = '/launcher';
}

const getMenuItems = () => [
	{
		name: $i18n.t('profileSidebar.personalInfo'),
		to: routePrefix + '/profile/personal-info',
		metrika: { name: 'xpp_profile_personal_click' },
		icon: '/profile/info.svg',
		showInLauncher: true,
	},
	{
		name: $i18n.t('profileSidebar.promocodes'),
		to: routePrefix + '/profile/promocodes',
		metrika: { name: 'xpp_profile_promo_click' },
		icon: '/profile/promocodes.svg',
		showInLauncher: true,
	},
	{
		name: $i18n.t('profileSidebar.myGames'),
		to: routePrefix + '/profile/games',
		metrika: { name: 'xpp_profile_games_click' },
		icon: '/profile/games.svg',
		showInLauncher: false,
	},
];

const route = useRoute();

const menu = computed(() => {
	if (!props.isLauncher) {
		return getMenuItems();
	}

	const params = new URLSearchParams();

	if (route.query.token) {
		params.append('token', route.query.token?.toString());
	}

	if (route.query.to) {
		params.append('to', route.query.to?.toString());
	}

	return getMenuItems()
		.filter((item) => item.showInLauncher)
		.map((item) => {
			return {
				...item,
				to: item.to + '?' + params.toString(),
			};
		});
});
</script>

<template>
	<div class="sidebar">
		<ul class="sidebar__list">
			<li
				v-for="({ name, to, icon, metrika }, index) in menu"
				:key="`SideBar ${index}}`"
				v-click-metrika="metrika"
				class="sidebar__item">
				<Link class="sidebar__link" :to="to" :class="{ active: route.fullPath === to }">
					<img class="sidebar__link-icon no-select" :src="icon" />
					<span class="sidebar__item-name">
						{{ name }}
					</span>
				</Link>
			</li>
		</ul>
	</div>
</template>
<style scoped lang="scss">
.m-sidebar {
	position: relative;
	border: 1px solid #8576fd;
	border-radius: 15px;

	&.open {
		.m-sidebar__dropdown {
			height: 100%;
			overflow: visible;
		}

		.m-sidebar__toggle-button {
			svg {
				transform: rotate(180deg);
			}
		}
	}
}

.m-sidebar__toggle {
	display: flex;
	align-items: center;
	border-radius: 15px;
	background: #1a1736;
	height: 60px;
	box-sizing: border-box;

	.m-sidebar__current-page {
		display: flex;
		align-items: center;
		margin: 0;
		padding: 20px;
		font-size: 14px;
		font-weight: 600;

		svg {
			margin-right: 10px;
		}

		.m-sidebar__name {
			font-weight: 600;
		}
	}

	.m-sidebar__toggle-button {
		width: 48px;
		height: 100%;
		margin-left: auto;

		svg {
			transform: rotate(0);
			trasnsition: transform linear 0.2s;
		}
	}
}

.m-sidebar__dropdown {
	height: 0;
	overflow: hidden;
	border-radius: 15px;
	//border: 1px solid #8576FD;
	background: #1a1736;
	transition: all linear 0.2s;
}

.m-sidebar__item {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	width: 100%;
	min-height: 40px;
	box-sizing: border-box;

	a {
		display: flex;
		align-items: center;
		margin: 0;
		padding: 0 20px 10px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;

		figure {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
			margin: 0 10px 0 0;
		}

		.m-sidebar__name {
			font-weight: 600;
		}
	}

	button {
		width: 48px;
		height: 100%;
		margin-left: auto;
	}

	&.active {
		.m-sidebar__name {
			color: #8576fd;
		}

		svg {
			path {
				fill: #8576fd;
			}
		}
	}
}

.m-sidebar__sublist {
	padding-left: 50px;

	.m-sidebar__link {
		padding: 0;
	}
}

.m-sidebar__sublist-item {
	min-height: 40px;
	font-size: 14px;
	font-style: normal;
	font-weight: 600;
	line-height: normal;

	&.active {
		.m-sidebar__name {
			color: #8576fd;
		}
	}
}
</style>
