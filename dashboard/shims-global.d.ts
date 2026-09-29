declare global {
	interface Window {
		is_system_user?: boolean;
		self_hosted_free_mode?: boolean;
	}
}

export {};
