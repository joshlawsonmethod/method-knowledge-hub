import type { PageServerLoad } from '../$types';
import { supabase } from '$lib/supabaseClient';
import { fail, type Actions } from '@sveltejs/kit';

type Instrument = {
	id: number;
	name: string;
};

export const load: PageServerLoad = async () => {
	const { data, error } = await supabase.from('instruments').select<'instruments', Instrument>();

	if (error) {
		console.error('Error loading instruments:', error.message);
		return { instruments: [] };
	}

	return {
		instruments: data ?? []
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const resourceType = formData.get('resource-select') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const tags = formData.get('tags') as string;
		const codeSnippet = formData.get('code-snippet') as string;
		const url = formData.get('url') as string;

		console.log({ resourceType, title, description, tags, codeSnippet, url });

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		const compiledInsert = {
			type: resourceType,
			title,
			description,
			author_id: user?.id,
			url,
			code_snippet: codeSnippet
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

			tagIds.push(existingTag.id);
		}

		// // Link tags to resource
		if (tagIds.length > 0) {
			const tagLinks = tagIds.map((tagId) => ({
				resource_id: resource.id,
				tag_id: tagId
			}));

			await locals.supabase.from('resource_tags').insert(tagLinks);
		}
	}
};
