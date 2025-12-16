/**
 * Simple logger for postMessage events
 */
export function logPostMessage(event: MessageEvent, context?: string) {
	console.log('PostMessage received in LTG:', {
		context,
		origin: event.origin,
		data: event.data,
	});
}
