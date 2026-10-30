-- إعداد الحفظ السحابي لمنصات المعلمين (يُشغَّل مرة واحدة في Supabase > SQL Editor)
create table if not exists public.pf_platforms(
  slug text primary key check (slug ~ '^[a-z0-9-]{2,40}$'),
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.pf_secrets(
  slug text primary key references public.pf_platforms(slug) on delete cascade,
  pin_hash text not null,
  fails int not null default 0,
  locked_until timestamptz
);
alter table public.pf_platforms enable row level security;
alter table public.pf_secrets enable row level security;
drop policy if exists pf_platforms_read on public.pf_platforms;
create policy pf_platforms_read on public.pf_platforms for select to anon, authenticated using (true);
revoke all on public.pf_secrets from anon, authenticated;
revoke insert, update, delete on public.pf_platforms from anon, authenticated;

create or replace function public.pf_check(p_slug text, p_pin text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare s public.pf_secrets;
begin
  select * into s from public.pf_secrets where slug = p_slug for update;
  if not found then return false; end if;
  if s.locked_until is not null and s.locked_until > now() then
    raise exception 'locked' using errcode = 'P0001';
  end if;
  if s.pin_hash = crypt(coalesce(p_pin,''), s.pin_hash) then
    update public.pf_secrets set fails = 0, locked_until = null where slug = p_slug;
    return true;
  end if;
  update public.pf_secrets set fails = s.fails + 1,
    locked_until = case when s.fails + 1 >= 5 then now() + interval '10 minutes' else null end
  where slug = p_slug;
  return false;
end $$;

create or replace function public.pf_save(p_slug text, p_pin text, p_state jsonb)
returns timestamptz language plpgsql security definer set search_path = public, extensions as $$
declare t timestamptz := now();
begin
  if not public.pf_check(p_slug, p_pin) then
    raise exception 'bad pin' using errcode = '28P01';
  end if;
  if pg_column_size(p_state) > 4000000 then
    raise exception 'state too large' using errcode = '54000';
  end if;
  update public.pf_platforms set state = p_state, updated_at = t where slug = p_slug;
  return t;
end $$;

revoke all on function public.pf_check(text, text) from public;
revoke all on function public.pf_save(text, text, jsonb) from public;
grant execute on function public.pf_check(text, text) to anon, authenticated;
grant execute on function public.pf_save(text, text, jsonb) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values ('pf-media', 'pf-media', true, 15728640)
on conflict (id) do nothing;

-- منصة شمساء ورمزها السري
insert into public.pf_platforms(slug) values ('shamsa') on conflict do nothing;
insert into public.pf_secrets(slug, pin_hash) values ('shamsa', extensions.crypt('CHANGE-ME', extensions.gen_salt('bf')))
on conflict (slug) do update set pin_hash = excluded.pin_hash, fails = 0, locked_until = null;
