import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/database.types';
// Helper to handle the "Find or Create" tag logic
async function updateTags(
	supabase: SupabaseClient<Database>,
	resourceId: number | string,
	tagsCsv: string
) {
	// 1. Clear existing links (Wipe)
	const { error: deleteError } = await supabase
		.from('resource_tags')
		.delete()
		.eq('resource_id', Number(resourceId));

	if (deleteError) throw new Error('Failed to clear old tags');

	if (!tagsCsv || tagsCsv.trim() === '') return;

	// 2. Process incoming tags (Replace)
	const tagsArray = tagsCsv
		.split(',')
		.map((tag) => tag.trim())
		.filter((tag) => tag.length > 0)
		.map((tag) => ({
			id: tag.toLowerCase().replace(/[^a-z0-9]/g, ''),
			name: tag
		}));

	const tagIds = [];

	for (const tag of tagsArray) {
		if (!tag.id) continue;

		// A. Try to find existing tag
		let { data: existingTag } = await supabase
			.from('tags')
			.select('id')
			.eq('slug', tag.id)
			.single();

		// B. Create if doesn't exist
		if (!existingTag) {
			const { data: newTag, error } = await supabase
				.from('tags')
				.insert({ name: tag.name, slug: tag.id })
				.select('id')
				.single();
			existingTag = newTag;

			if (error) {
				console.error('Error creating tag', error);
			}
		}

		if (existingTag) {
			tagIds.push(existingTag.id);
		}
	}

	// 3. Insert new links
	if (tagIds.length > 0) {
		// Use a Set to ensure unique IDs (prevents duplicate key errors if user typed "JS, JS")
		const uniqueTagIds = [...new Set(tagIds)];

		const tagLinks = uniqueTagIds.map((tagId) => ({
			resource_id: resourceId as unknown as number,
			tag_id: tagId
		}));

		const { error: insertError } = await supabase.from('resource_tags').insert(tagLinks);

		if (insertError) {
			console.error('DEEP DB ERROR:', insertError);
			throw new Error(`Failed to insert new tags: ${insertError.message}`);
		}
	}
}

export default updateTags;
