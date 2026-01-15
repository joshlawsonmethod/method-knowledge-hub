import type { Database } from './database.types';

type ProfileData = Database['public']['Tables']['profiles']['Row'];
type ResourceRow = Database['public']['Functions']['get_resources']['Returns'][0];

type Resource = {
	id: ResourceRow['id'];
	type: ResourceRow['type'];
	title: ResourceRow['title'];
	description: ResourceRow['description'];
	author_id: ResourceRow['author_id'];
	url: ResourceRow['url'] | null;
	created_at: ResourceRow['created_at'];
	updated_at: ResourceRow['updated_at'] | null;
	code_snippet?: ResourceRow['code_snippet'] | null;
	author: {
		first_name: ProfileData['first_name'];
		last_name: ProfileData['last_name'];
	} | null;
	tags: { tag: { id: number; name: string; slug: string } }[];
};

type Tag = Database['public']['Tables']['tags']['Row'];
type ResourceType = Database['public']['Enums']['resource_type'];

export type { Resource, ResourceType, Tag };
