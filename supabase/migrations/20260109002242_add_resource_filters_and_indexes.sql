-- create indices
CREATE INDEX IF NOT EXISTS idx_resource_tags_tag_resource ON resource_tags(tag_id, resource_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
-- update get_resources
DROP FUNCTION IF EXISTS get_resources;
CREATE OR REPLACE FUNCTION get_resources(
        tag_ids int [] default null,
        resource_types public.resource_type [] default null
    ) RETURNS TABLE (
        id bigint,
        type public.resource_type,
        title text,
        description text,
        url text,
        created_at timestamptz,
        updated_at timestamptz,
        author jsonb,
        tags jsonb
    ) LANGUAGE sql STABLE AS $$
SELECT r.id,
    r.type,
    r.title,
    r.description,
    r.url,
    r.created_at,
    r.updated_at,
    jsonb_build_object(
        'first_name',
        p.first_name,
        'last_name',
        p.last_name
    ) AS author,
    COALESCE(
        jsonb_agg(
            DISTINCT jsonb_build_object(
                'tag',
                jsonb_build_object(
                    'id',
                    t.id,
                    'name',
                    t.name,
                    'slug',
                    t.slug
                )
            )
        ) FILTER (
            WHERE t.id IS NOT NULL
        ),
        '[]'::jsonb
    ) AS tags
FROM resources r
    JOIN profiles p ON p.id = r.author_id
    LEFT JOIN resource_tags rt ON rt.resource_id = r.id
    LEFT JOIN tags t ON t.id = rt.tag_id
WHERE (
        (
            tag_ids IS NULL
            OR cardinality(tag_ids) = 0
        )
        OR EXISTS (
            SELECT 1
            FROM resource_tags rt2
            WHERE rt2.resource_id = r.id
                AND rt2.tag_id = ANY(tag_ids)
        )
    )
    AND (
        (
            resource_types IS NULL
            OR cardinality(resource_types) = 0
        )
        OR r.type = ANY(resource_types)
    )
GROUP BY r.id,
    p.first_name,
    p.last_name;
$$;