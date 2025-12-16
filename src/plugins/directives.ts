import { backgroundImage } from '../utils/directives';

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('background-image', backgroundImage);
});
