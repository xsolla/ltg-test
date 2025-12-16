type ResourceType = 'js' | 'css';

type LoadResourceOptions = {
	type: ResourceType;
	onResourceLoaded?: VoidFunction;
};

export const loadResource = (url: string, parameters: LoadResourceOptions) => {
	const { type, onResourceLoaded } = parameters;

	let resourceElement: HTMLScriptElement | HTMLLinkElement;

	if (type === 'js') {
		resourceElement = document.createElement('script');

		resourceElement.src = url;
		resourceElement.async = true;
		resourceElement.type = 'text/javascript';
	} else {
		resourceElement = document.createElement('link');

		resourceElement.href = url;
		resourceElement.rel = 'stylesheet';
		resourceElement.type = 'text/css';
	}

	if (onResourceLoaded) {
		resourceElement.addEventListener('load', onResourceLoaded);
	}

	document.head.appendChild(resourceElement);
};
