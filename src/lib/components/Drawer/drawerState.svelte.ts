import type { Resource } from '$lib/supabase/schema.types';

export const drawer: {
	action?: 'create' | 'view' | 'edit';
	isOpen: boolean;
	resource?: Resource | null;
} = $state({
	action: undefined,
	isOpen: false,
	resource: null
});
