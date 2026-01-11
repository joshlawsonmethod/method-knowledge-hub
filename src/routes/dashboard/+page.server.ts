import type { PageServerLoad } from '../$types';
import { fail, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const resourcesQuery = locals.supabase.from('resources').select(
		`
				id,
				type,
				title,
				description,
				code_snippet,
				url,
				created_at,
				updated_at,
				author:profiles(first_name, last_name),
				tags:resource_tags(tag:tags(id, name, slug))
			`
	);

	const { data: resources, error: resourcesError } = await resourcesQuery;

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

		// Process tags
		const tagsArray = tags
			.split(',')
			.map((tag) => ({ id: tag.toLowerCase().replace(/[^a-z0-9]/g, ''), name: tag }));
		const tagIds = [];
		for (const tag of tagsArray) {
			if (!tag.id) continue;

			// Try to find existing tag
			let { data: existingTag } = await locals.supabase
				.from('tags')
				.select('id')
				.eq('slug', tag.id)
				.single();

			// Create if doesn't exist
			if (!existingTag) {
				const { data: newTag } = await locals.supabase
					.from('tags')
					.insert({ name: tag.name, slug: tag.id })
					.select('id')
					.single();

				existingTag = newTag;
			}

			tagIds.push(existingTag?.id);
		}

		// // Link tags to resource
		if (tagIds.length > 0) {
			const tagLinks = tagIds.map((tagId) => ({
				resource_id: resource.id,
				tag_id: tagId
			}));

			await locals.supabase.from('resource_tags').insert(tagLinks);
		}
	},
	edit: async () => {
		console.log('triggered edit!');
		// locals.supabase.from('resources').update()
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
