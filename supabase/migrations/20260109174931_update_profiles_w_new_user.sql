-- 1. Create a function that handles the data transfer
create or replace function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$ begin
insert into public.profiles (id, first_name, last_name)
values (
        new.id,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name'
    );
return new;
end;
$$;
-- 2. Create the trigger to fire the function
create or replace trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();