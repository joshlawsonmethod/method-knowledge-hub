DROP FUNCTION IF EXISTS get_resources;
CREATE OR REPLACE FUNCTION get_resources(
        tag_ids int [] default null,
        resource_types public.resource_type [] default null,
        search_query text default '' -- <--- NEW PARAMETER
    ) RETURNS TABLE (
        id bigint,
        type public.resource_type,
        author_id uuid,
        -- Ensure this matches your table's actual type (uuid or text)
        title text,
        description text,
        code_snippet text,
        url text,
        created_at timestamptz,
        updated_at timestamptz,
        author jsonb,
        tags jsonb
    ) LANGUAGE sql STABLE AS $$
SELECT r.id,
    r.type,
    r.author_id,
    r.title,
    r.description,
    r.code_snippet,
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
WHERE -- Existing Filters
    (
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
    ) -- NEW: Search Logic (Case Insensitive)
    AND (
        search_query IS NULL
        OR search_query = ''
        OR (
            r.title ILIKE '%' || search_query || '%'
            OR r.description ILIKE '%' || search_query || '%'
        )
    )
GROUP BY r.id,
    r.author_id,
    p.first_name,
    p.last_name;
$$;