import type { PageServerLoad } from '../$types';
import { fail, type Actions } from '@sveltejs/kit';
import type { Resource, ResourceType } from '$lib/supabase/schema.types';
import updateTags from '$lib/helpers/updateTags';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (user) {
		redirect(303, '/');
	}

	const searchQuery = url.searchParams.get('search') ?? undefined;

	const resourcesQuery = locals.supabase.rpc('get_resources', {
		tag_ids: undefined,
		resource_types: undefined,
		search_query: searchQuery
	});

	const { data, error: resourcesError } = await resourcesQuery;

	const resources: Resource[] = (data ?? []).map((r) => ({
		...r,
		author: r.author as { first_name: string | null; last_name: string | null } | null,
		tags: Array.isArray(r.tags) ? r.tags : []
	})) as unknown as Resource[];

	if (resourcesError) {
		console.error('Error loading resources', resourcesError.message);
		return { resources: [] };
	}

	const { data: tags, error: tagsError } = await locals.supabase.from('tags').select();

	if (tagsError) {
		console.error('Error loading resources', tagsError.message);
		return { tags: [] };
	}

	return { resources, tags };
};

export const actions: Actions = {
	'new-resource': async ({ request, locals }) => {
		const formData = await request.formData();
		const resourceType = formData.get('resource-select');
		const title = formData.get('title');
		const description = formData.get('description');
		const tags = formData.get('tags') as string;
		const codeSnippet = formData.get('code-snippet');
		const url = formData.get('url');

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		const compiledInsert = {
			type:
				typeof resourceType === 'string'
					? (resourceType as 'code_snippet' | 'article' | 'learning_resource')
					: 'article', // or your default type
			title: typeof title === 'string' ? title : '',
			description: typeof description === 'string' ? description : '',
			author_id: user?.id ?? '',
			url: typeof url === 'string' ? url : '',
			code_snippet: typeof codeSnippet === 'string' ? codeSnippet : null
		};

		const { data: resource, error } = await locals.supabase
			.from('resources')
			.insert(compiledInsert)
			.select()
			.single();

		if (error) return fail(500, { error: 'Failed to create resource' });

		try {
			await updateTags(locals.supabase, resource.id, tags);
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Resource created, but tags failed to save.' });
		}
	},
	'edit-resource': async ({ locals, request }) => {
		const formData = await request.formData();
		const id = formData.get('editing-id') as unknown as number;

		// 1. Validate User (optional because of RLS but extra-safe!)
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		// 2. Prepare Data
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const resourceType = formData.get('resource-select') as ResourceType;
		const url = formData.get('url') as string;
		const codeSnippet = formData.get('code-snippet') as string;

		// 3. Update Resource
		const { error: updateError } = await locals.supabase
			.from('resources')
			.update({
				title,
				description,
				type: resourceType,
				url: resourceType === 'article' ? url : null,
				code_snippet: resourceType === 'code_snippet' ? codeSnippet : null,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.eq('author_id', user.id);

		if (updateError) {
			return fail(500, { error: 'Failed to update resource' });
		}

		// 4. Handle Tags (Optional Step)
		const tags = formData.get('tags') as string;
		try {
			await updateTags(locals.supabase, id, tags);
		} catch (e) {
			console.error(e);
			return fail(500, { error: 'Resource updated, but tags failed to save.' });
		}

		return { success: true };
	},
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		const { error } = await locals.supabase.from('resources').delete().eq('id', id);

		if (error) {
			console.error('Delete error: ', error);
			return fail(500, { error: 'Failed to delete resource' });
		}

		return { success: true };
	}
};
