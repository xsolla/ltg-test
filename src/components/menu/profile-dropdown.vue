<script setup lang="ts">
import { ref } from 'vue';
import LDropdown from '~/components/base/l-dropdown.vue';
import ProfileIcon from '~/components/icon/profile.vue';
import type { DropdownMenuItem } from '~/types/components';
import ArrowDownIcon from '~/components/icon/arrow-down.vue';
import type { UserData } from '~/types';

const { $i18n, $router } = useNuxtApp();
const isExpanded = ref(false);

const menuItems = computed<DropdownMenuItem[]>(()=>{
	return [
		{
			href: '/profile/personal-info',
			title: $i18n.t('menu.profile'),
			metricsData: {
				name: 'xpp_main_profile_click',
			},
		},
		{ value: 'logout', title: $i18n.t('menu.logout') },
	]
});

// Имя пользователя (предполагается, что его нужно получить из глобального состояния или API)
const user = useState<{data:UserData} | undefined>('user');

// Вычисляемое свойство для обрезания имени до 15 символов
const shortUserName = computed(() => {

	if(!user.value?.data.username) {
		return 'ShortUsername';
	}
	const username = user.value?.data.username;

	// Если длина имени пользователя больше 15 символов, обрезаем
	return username.length > 15 ? username.slice(0, 15) + '...' : username;
});

const onExpansionToggle = (isDropdownExpanded: boolean) => {
	isExpanded.value = isDropdownExpanded;
};

const onWindowScroll = () => {
	isExpanded.value = false;
};

const onItemClick = async (value: string) => {
	if (value === 'logout') {
		await $router.replace({ path: `/logout` });
	}
};

onBeforeMount(() => {
	window.addEventListener('scroll', onWindowScroll);
});

onBeforeUnmount(() => {
	window.removeEventListener('scroll', onWindowScroll);
});
</script>

<template>
	<LDropdown
		@toggle-expansion="onExpansionToggle"
		:is-expanded="isExpanded"
		@menu-item-click="onItemClick"
		:menu-items="menuItems">
		<template v-slot:expansion-button-content>
			<div class="dropdown-button">
				<span class="username">{{ shortUserName }}</span>
			</div>
			<ArrowDownIcon class="l-dropdown__arrow"/>
		</template>
	</LDropdown>
</template>
<style scoped>

.l-dropdown__arrow {
	fill: #ffffff;

  	path {
		fill: #ffffff;
	}
}

.dropdown-button {
	display: flex;
	align-items: center;
	gap: 8px;
}

.username {
	font-family: 'Pilat Wide', 'Montserrat', Helvetica, Arial, sans-serif;
	font-size: 14px;
	font-weight: 500;
	color: #ffffff;
}
</style>
