import type { Database } from './database.types';

type ProfileData = Database['public']['Tables']['profiles']['Row'];
type ResourceRow = Database['public']['Functions']['get_resources']['Returns'][0];

export type Resource = {
	id: ResourceRow['id'];
	type: ResourceRow['type'];
	title: ResourceRow['title'];
	description: ResourceRow['description'];
	url: ResourceRow['url'] | null;
	created_at: ResourceRow['created_at'];
	updated_at: ResourceRow['updated_at'] | null;
	code_snippet?: ResourceRow['code_snippet'] | null;
	author: {
		first_name: ProfileData['first_name'];
		last_name: ProfileData['last_name'];
	} | null;
	tags: Array<{
		tag: {
			id: string | number;
			name: string;
			slug: string;
		} | null;
	}>;
};
