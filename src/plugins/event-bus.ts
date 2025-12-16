import mitt from 'mitt';

// Структура: <имя события> : <его payload>
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type EventPayload = string | true | void;
type ApplicationEvents = {
	'paystation:opened': EventPayload;
	'paystation:closed': EventPayload;
	'paystation:purchased': EventPayload;
	'modal:opened': EventPayload;
	'modal:closed': EventPayload;
	'user:updated': EventPayload;
};

export default defineNuxtPlugin(() => {
	const emitter = mitt<ApplicationEvents>();

	return {
		provide: {
			events: emitter,
		},
	};
});
