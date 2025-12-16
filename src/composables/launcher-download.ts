import { useNuxtApp, useCookie, useRouter } from 'nuxt/app';
import { downloadAndRenameLauncher } from '@/utils/download-launcher';
import platformUtils from '~/utils/platform';
import { useUseragent } from '~/composables/useragent';

function useLauncherDownload() {
	const router = useRouter();
	const { $api } = useNuxtApp();
	const ltgCode = useCookie('ltg_code');
	const { useragent } = useUseragent();

	const getLauncherSlug = (gameSlug?: string | Array<string>) => {
		if (typeof gameSlug === 'string') {
			return gameSlug?.replace('/', '');
		}

		return 'default';
	};

	const handleLauncherDownload = async (gameSlug?: string) => {
		const launcherDownloadData = await $api.getLauncherDownloadData({
			launcherSlug: getLauncherSlug(gameSlug),
			ltgCode: ltgCode.value,
		});

		if (!platformUtils.isMac(useragent)) {
			downloadAndRenameLauncher({
				launcherUrl: launcherDownloadData.link,
				launcherFilename: launcherDownloadData?.installerFilename,
			});
		}
		// @ts-expect-error
		// eslint-disable-next-line
		if (typeof gtag !== 'undefined') {
			// @ts-expect-error
			// eslint-disable-next-line
			gtag('event', `launcher_download`);
		}

		return launcherDownloadData;
	};

	const handleDownloadPageNavigation = async (gameSlug?: string) => {
		if (!platformUtils.isMac(useragent)) {
			await router.push(`/download-launcher/${getLauncherSlug(gameSlug)}`);
		}
	};

	return { handleLauncherDownload, handleDownloadPageNavigation };
}

export default useLauncherDownload;
