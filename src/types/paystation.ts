export type Paystation = {
	open: VoidFunction;
	// TODO: add paystation config type
	init: (options: Record<string, unknown>) => void;
};
