create or replace function fetch_resources(tag_ids int [] default null) returns table (
        id uuid,
        type text,
        title text,
        description text,
        url text,
        created_at timestamptz,
        updated_at timestamptz,
        author jsonb,
        tags jsonb
    ) language sql stable as $$
select r.id,
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
    ) as author,
    coalesce(
        jsonb_agg(
            distinct jsonb_build_object(
                'id',
                t.id,
                'name',
                t.name,
                'slug',
                t.slug
            )
        ) filter (
            where t.id is not null
        ),
        '[]'::jsonb
    ) as tags
from resources r
    join profiles p on p.id = r.author_id
    left join resource_tags rt on rt.resource_id = r.id
    left join tags t on t.id = rt.tag_id
where tag_ids is null
    or exists (
        select 1
        from resource_tags rt2
        where rt2.resource_id = r.id
            and rt2.tag_id = any(tag_ids)
    )
group by r.id,
    p.first_name,
    p.last_name;
$$;