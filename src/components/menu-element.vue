<script lang="ts" setup>
import LDropdown from '~/components/base/l-dropdown.vue';
import ZendeskAuthForm from '~/components/zendesk-auth-form.vue';
import type { MenuItem } from '~/types';
import ArrowDownIcon from '~/components/icon/arrow-down.vue';

interface Props {
	item: MenuItem;
	isSelected?: boolean;
	variant?: 'header' | 'footer';
	source?: string;
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'header',
});

const type = props.item?.name.split('\.')?.[1];
if (['forum', 'support', 'news'].includes(type)) {
	// eslint-disable-next-line
	props.item.xm = {
		exv: { place: props.source },
		name: type === 'news' ? 'xpp_main_news_more_click' : `xpp_main_${type}_click`,
	};
}

const { $api, $router } = useNuxtApp();

const isDropdownExpanded = ref(false);

const dropdownElements = computed(() => {
	return props.item.dropdown?.map((item) => {
		return {
			href: item.to,
			title: item.name,
		};
	});
});

const onDropdownExpansionToggle = (isExpanded: boolean) => {
	isDropdownExpanded.value = isExpanded;
};
</script>

<template>
	<!--TODO  https://xsolla.atlassian.net/browse/XPP-366 menu.forum -->
	<li>
		<template v-if="!dropdownElements">
			<NuxtLink
				v-if="item.name !== 'menu.support'"
				v-click-metrika="item.xm"
				:href="item.to"
				:target="item.target || '_self'"
				:class="[
					$style.link,
					{
						[$style['is-selected']]: isSelected,
						[$style.header]: variant === 'header',
						[$style.footer]: variant === 'footer',
					},
				]">
				{{ $t(item.name) }}
			</NuxtLink>

			<template v-else>
				<ZendeskAuthForm>
					<button
						type="submit"
						:class="[
							$style.link,
							{
								[$style.header]: variant === 'header',
								[$style.footer]: variant === 'footer',
							},
						]">
						{{ $t(item.name) }}
					</button>
				</ZendeskAuthForm>
			</template>
		</template>

		<LDropdown
			v-else
			@toggle-expansion="onDropdownExpansionToggle"
			:is-expanded="isDropdownExpanded"
			expansion-condition-variant="on-hover"
			:menu-items="dropdownElements">
			<template v-slot:expansion-button-content>
				<span
					:class="[
						$style.link,
						{
							[$style.header]: variant === 'header',
							[$style.footer]: variant === 'footer',
						},
					]"
				>
					{{ $t(item.name) }}
				</span>
				<ArrowDownIcon class="menu-arrow"/>
			</template>
		</LDropdown>
	</li>
</template>

<style lang="scss" module>
.link {
	transition: color var(--common-transition-duration-easing-function);
	cursor: pointer;

	font-size: 14px;
	line-height: 40px;
	font-weight: 600;

	&.header {
		font-family: var(--pilat-wide-font-family);
		text-transform: uppercase;
		font-weight: 400;
	}

	&.footer {
		color: var(--white);
	}

	&.is-selected {
		color: var(--secondary-dark-text-color);
	}

	&:hover {
		background: var(--accent-gradient);
		background-clip: text;
		color: transparent;
	}

	&:hover {
		&::after {
			transform: scaleX(1);
		}
	}
}

</style>
