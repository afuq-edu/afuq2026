-- مزامنة خاصة بين أجهزة المعلمة (بيانات خاصة لا يراها أحد دون الرمز السري)
-- تُشغَّل مرة واحدة. الجداول مقفلة عن العامة، والوصول فقط عبر الدوال بالرمز.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.vault_sync(
  slug text primary key check (slug ~ '^[a-z0-9-]{2,40}$'),
  pin_hash text not null,
  state jsonb,
  rev bigint not null default 0,
  updated_at timestamptz,
  fails int not null default 0,
  locked_until timestamptz
);
create table if not exists public.vault_blobs(
  slug text not null references public.vault_sync(slug) on delete cascade,
  k text not null check (length(k) <= 80),
  v text not null,
  primary key (slug, k)
);
alter table public.vault_sync enable row level security;
alter table public.vault_blobs enable row level security;
revoke all on public.vault_sync, public.vault_blobs from anon, authenticated;

-- التحقق من الرمز: 5 محاولات خاطئة تقفل المنصة 10 دقائق (تُعيد false ولا ترمي استثناء كي لا يُلغى العدّاد)
create or replace function public.vault_auth(p_slug text, p_pin text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare s public.vault_sync;
begin
  select * into s from public.vault_sync where slug = p_slug for update;
  if not found then return false; end if;
  if s.locked_until is not null and s.locked_until > now() then
    raise exception 'locked' using errcode = 'P0001';
  end if;
  if s.pin_hash = crypt(coalesce(p_pin, ''), s.pin_hash) then
    if s.fails > 0 then update public.vault_sync set fails = 0, locked_until = null where slug = p_slug; end if;
    return true;
  end if;
  update public.vault_sync set fails = s.fails + 1,
    locked_until = case when s.fails + 1 >= 5 then now() + interval '10 minutes' else null end
  where slug = p_slug;
  return false;
end $$;

create or replace function public.vault_pull(p_slug text, p_pin text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare s public.vault_sync;
begin
  if not public.vault_auth(p_slug, p_pin) then return jsonb_build_object('error', 'bad pin'); end if;
  select * into s from public.vault_sync where slug = p_slug;
  return jsonb_build_object('rev', s.rev, 'at', s.updated_at, 'state', s.state,
    'keys', coalesce((select jsonb_agg(k) from public.vault_blobs where slug = p_slug), '[]'::jsonb));
end $$;

create or replace function public.vault_push(p_slug text, p_pin text, p_state jsonb, p_base bigint)
returns jsonb language plpgsql security definer set search_path = public as $$
declare s public.vault_sync;
begin
  if not public.vault_auth(p_slug, p_pin) then return jsonb_build_object('error', 'bad pin'); end if;
  select * into s from public.vault_sync where slug = p_slug for update;
  if s.rev <> coalesce(p_base, 0) then return jsonb_build_object('error', 'conflict', 'rev', s.rev); end if;
  if pg_column_size(p_state) > 8000000 then return jsonb_build_object('error', 'too large'); end if;
  update public.vault_sync set state = p_state, rev = s.rev + 1, updated_at = now() where slug = p_slug;
  return jsonb_build_object('rev', s.rev + 1, 'at', now());
end $$;

create or replace function public.vault_blob_put(p_slug text, p_pin text, p_k text, p_v text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.vault_auth(p_slug, p_pin) then return jsonb_build_object('error', 'bad pin'); end if;
  if length(p_v) > 6000000 then return jsonb_build_object('error', 'too large'); end if;
  insert into public.vault_blobs(slug, k, v) values (p_slug, p_k, p_v)
  on conflict (slug, k) do update set v = excluded.v;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.vault_blob_get(p_slug text, p_pin text, p_ks text[])
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.vault_auth(p_slug, p_pin) then return jsonb_build_object('error', 'bad pin'); end if;
  return jsonb_build_object('blobs', coalesce((select jsonb_object_agg(k, v) from public.vault_blobs where slug = p_slug and k = any(p_ks)), '{}'::jsonb));
end $$;

create or replace function public.vault_blob_del(p_slug text, p_pin text, p_ks text[])
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.vault_auth(p_slug, p_pin) then return jsonb_build_object('error', 'bad pin'); end if;
  delete from public.vault_blobs where slug = p_slug and k = any(p_ks);
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.vault_auth(text, text) from public, anon, authenticated;
revoke all on function public.vault_pull(text, text), public.vault_push(text, text, jsonb, bigint),
  public.vault_blob_put(text, text, text, text), public.vault_blob_get(text, text, text[]), public.vault_blob_del(text, text, text[]) from public;
grant execute on function public.vault_pull(text, text), public.vault_push(text, text, jsonb, bigint),
  public.vault_blob_put(text, text, text, text), public.vault_blob_get(text, text, text[]), public.vault_blob_del(text, text, text[]) to anon, authenticated;

-- لكل منصة: صف برمزها السري (يُغيَّر الرمز بنفس الأمر)
-- insert into public.vault_sync(slug, pin_hash) values ('safia', extensions.crypt('123456', extensions.gen_salt('bf')))
-- on conflict (slug) do update set pin_hash = excluded.pin_hash, fails = 0, locked_until = null;
