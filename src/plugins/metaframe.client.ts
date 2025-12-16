import { isElectron } from '~/utils/platform';
import type { MetaframeEvent } from '@/types/metaframe';
import { IS_LIF_COINS_MODAL_VISIBLE_STATE_KEY } from '@/constants/state-keys';
import useMobileTablet from '@/composables/mobile-tablet-desktop';
import { logPostMessage } from '@/utils/postmessage-logger'

export default defineNuxtPlugin((nuxtApp) => {
	const config = nuxtApp.$config.public
	const route = useRoute();
	const showMetaframe = Boolean(config.SHOW_METAFRAME);
	const disableMetaframe = route.path === '/sign-in' || route.path.includes("/metaframe/");
	if (showMetaframe && !disableMetaframe && !isElectron()) {
		const metaframeScript = document.createElement('script');

		metaframeScript.src = `https://cdn.xsolla.net/metaframe-web-wallet-widget-prod/container/${config.METAFRAME_VERSION}/metaframe.js`;

		const { mobile } = useMobileTablet()

		metaframeScript.onload = () => {
			window.metaframe.create({
				loginProjectId: config.LOGIN_PROJECT_ID,
				merchantId: Number(config.MERCHANT_ID),
				projectId: Number(config.METAFRAME_PROJECT_ID),
				isMobile: mobile.value,
			});
		};

		watch(mobile, (val) => {
			window.metaframe.setIsMobile(val)
		})

		document.body.appendChild(metaframeScript);

		window.addEventListener(
			'@metaframe-partner-events:login-successful',
			async (event: Event) => {
				const { detail } = event as MetaframeEvent;
				await useSetAuth(detail.token);
			}
		);

		const router = useRouter();

		window.addEventListener(
			'@metaframe-partner-events:logout-successful',
			async () => {
				// await router.push('/logout');
			}
		);

	window.addEventListener('message', (event: { data?: { type: string } }) => {
		logPostMessage(event as MessageEvent, 'Metaframe Balance Button');
		if (
			event.data?.type ===
			'@metaframe-partner-events:mini-app-menu-button-clicked:Balance'
		) {
			const isOpened = useState<boolean>(IS_LIF_COINS_MODAL_VISIBLE_STATE_KEY);
			isOpened.value = !isOpened.value;
		}
	});
	}
});
