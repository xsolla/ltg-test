const LAUNCHER_FRAME_TARGET_ORIGIN = 'https://installer.launcher.xsolla.com';
const LAUNCHER_FRAME_ID = 'xsolla-installer-renamer';
const LAUNCHER_RENAMER_URL =
	'https://installer.launcher.xsolla.com/launcher-installer-renamer-prod/v1/renamer.html';

export function downloadAndRenameLauncher({
	launcherUrl,
	launcherFilename,
}: {
	launcherUrl: string;
	launcherFilename?: string;
}) {
	const launcherFrame = createLauncherFrame();

	launcherFrame.addEventListener('load', () => {
		if (launcherFrame.contentWindow) {
			launcherFrame.contentWindow.postMessage(
				{
					type: 'download',
					href: launcherUrl,
					name: launcherFilename,
				},
				LAUNCHER_FRAME_TARGET_ORIGIN
			);
		} else {
			const downloadLink = document.createElement('a');
			downloadLink.href = launcherUrl as string;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}
	});
}

/**
 * Create launcher frame
 */
function createLauncherFrame() {
	const oldLauncherFrame = document.getElementById(LAUNCHER_FRAME_ID);
	if (oldLauncherFrame) {
		document.body.removeChild(oldLauncherFrame);
	}
	const launcherFrame = document.createElement('frame');
	launcherFrame.id = LAUNCHER_FRAME_ID;
	launcherFrame.src = `${LAUNCHER_RENAMER_URL}?cache=${Date.now()}`;
	// @ts-expect-error
	// noinspection JSConstantReassignment
	launcherFrame.style = 'display: none';

	document.body.append(launcherFrame);

	return launcherFrame;
}
