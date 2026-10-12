-- BioGestión: tabla para inscripciones a la beta
-- Ejecuta este archivo en Supabase > SQL Editor.
-- Esta política permite insertar inscripciones, pero no permite lectura pública.

create extension if not exists pgcrypto;

create table if not exists public.beta_signups (
  id uuid primary key default gen_random_uuid(),
  nombre text not null
    check (char_length(trim(nombre)) >= 2 and char_length(nombre) <= 120),
  correo text not null
    check (position('@' in correo) > 1 and char_length(correo) <= 254),
  perfil_empresa text not null
    check (char_length(trim(perfil_empresa)) > 0 and char_length(perfil_empresa) <= 180),
  necesidad text not null
    check (necesidad in ('Inventario', 'Mantenimiento', 'Cronogramas', 'Reportes', 'Otra necesidad')),
  interes text not null
    check (interes in ('Probar la beta', 'Recibir una demostración', 'Conocer precios')),
  consentimiento boolean not null default false
    check (consentimiento = true),
  fecha_inscripcion timestamptz not null default now()
);

alter table public.beta_signups enable row level security;

drop policy if exists "Public can submit beta signup" on public.beta_signups;
create policy "Public can submit beta signup"
on public.beta_signups
for insert
to anon
with check (
  consentimiento = true
  and char_length(trim(nombre)) >= 2
  and position('@' in correo) > 1
  and necesidad in ('Inventario', 'Mantenimiento', 'Cronogramas', 'Reportes', 'Otra necesidad')
  and interes in ('Probar la beta', 'Recibir una demostración', 'Conocer precios')
);

-- No crear políticas SELECT públicas.
-- No poner service_role key en el frontend.
