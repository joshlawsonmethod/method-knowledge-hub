import type { Resource } from '$lib/supabase/resource.types';

export const drawer: { isOpen: boolean; resource?: Resource | null } = $state({
	isOpen: false,
	resource: null
});
