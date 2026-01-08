import type { Database } from './database.types';

type ProfileData = Database['public']['Tables']['profiles']['Row'];
type ResourceRow = Database['public']['Tables']['resources']['Row'];

export type Resource = {
	id: ResourceRow['id'];
	type: ResourceRow['type'];
	title: ResourceRow['title'];
	description: ResourceRow['description'];
	url: ResourceRow['url'];
	created_at: ResourceRow['created_at'];
	updated_at: ResourceRow['updated_at'];
	code_snippet?: ResourceRow['code_snippet'];
	author: {
		first_name: ProfileData['first_name'];
		last_name: ProfileData['last_name'];
	} | null;
	tags: Array<{
		tag: {
			id: string;
			name: string;
			slug: string;
		};
	}>;
};
