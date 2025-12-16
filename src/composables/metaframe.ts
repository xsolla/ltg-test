import type { Metaframe } from '@/types/metaframe';

export function useMetaframe() {
	const metaframe = useState<Metaframe>('metaframe', () => window?.metaframe);

	// If metaframe hasn't loaded, try again in 1.5 sec
	const refreshMetaframeValue = () => {
		if (!metaframe.value) {
			setTimeout(() => {
				metaframe.value = window?.metaframe;
				refreshMetaframeValue();
			}, 1500);
		}
	};
	refreshMetaframeValue();

	return metaframe;
}
