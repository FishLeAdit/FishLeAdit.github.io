# Jawad Adit Chowdhury: 98.portfolio

My portfolio, built as a Windows 98 desktop. Boot it up, open the **Projects** folder, read my resume, or get in touch through **Contact me**.

## What's on the desktop

- **Projects**: loaded from a Supabase table. Each project opens as a folder with its README (pulled live from GitHub), the live site, the source code and any write-up.
- **My Resume**: my CV in the built-in document viewer.
- **Contact me**: e-mail, phone, GitHub and LinkedIn.
- **HSRD write-up**: a 90s-style page about my thesis on pediatric brain tumor segmentation. It opens in the desktop's Internet Explorer and also stands alone at [`/brain-tumor/`](public/brain-tumor/index.html).
- **Display Properties** (Start → Settings, or right-click the desktop): change the wallpaper and color scheme. Your choice is saved in the browser.
- Startup chime and click sounds, controlled from the taskbar volume icon.

## Tech

Next.js 14 (App Router, static export), React 18, TypeScript, Redux Toolkit, Tailwind CSS, Framer Motion, Supabase.

## Running it locally

```bash
npm install
cp .env.EXAMPLE .env.local   # then fill in your Supabase URL and publishable key
npm run dev
```

Open http://localhost:3000 and press **Enter** to boot.

## Supabase setup

Create a free Supabase project and run this in the SQL Editor:

```sql
create table public."Project" (
  id              bigint generated always as identity primary key,
  name            text    not null,
  description     text    not null,
  done            boolean not null default true,
  images          text[]  not null default '{}',
  deployment_url  text,
  github_url      text,
  date            date    not null,
  type            text    not null check (type in ('WEB', 'RESEARCH')),
  writeup         text    -- key into WRITEUPS in src/constants, e.g. 'brain-tumor'
);

-- The publishable key ships in the public JS bundle; RLS keeps the table read-only.
alter table public."Project" enable row level security;
create policy "Public read" on public."Project" for select to anon using (true);
```

Add rows from the Table Editor. Changes show up on the site without a redeploy.

## Credits

Built on [98.portfolio](https://github.com/AlexandreDresch/98.portfolio) by **Alexandre Dresch**, trimmed down and adapted. The Windows 98 desktop, window manager and most of the UI are his work.
