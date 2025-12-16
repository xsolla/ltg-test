<template>
	<section class="content-page">
		<div class="container">
			<h2 class="">Launcher tag</h2>
		</div>
	</section>
</template>

<script>
import { logPostMessage } from '@/utils/postmessage-logger';

export default {
	name: 'LauncherTag',
	layout: 'main',
	async mounted() {
		this.setAddEventListener();
	},
	methods: {
		setAddEventListener() {
			window.addEventListener('message', this.receiveMessage.bind(this), false);
		},
	async receiveMessage(event) {
		logPostMessage(event, 'Launcher Tag');
		if (event?.data?.type === 'xsolla-tag-manager') {
				try {
					const url = 'https://backoffice.longtale.games/api/xsolla/launcher';
					const options = {
						method: 'POST',
						body: JSON.stringify(event.data),
					};
					await fetch(url, options);
				} catch (e) {
					console.error(e);
				}
			}
		},
	},
};
</script>
