type DropdownMenuItemActionParams =
	| { href: string; value?: never }
	| { href?: never; value: string };

export type DropdownMenuItem = {
	title: string;
	isSelected?: boolean;
	metricsData?: {
		name?: string;
		ev?: string;
		exv?: { place?: string; type?: string };
	};
} & DropdownMenuItemActionParams;
