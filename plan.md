# Portfolio Plan: Jawad Adit Chowdhury (Windows 98 Edition)

Base: the `AlexandreDresch/98.portfolio` template, cloned into `98.portfolio/`.
Approach: keep the Win98 look and feel and the template's architecture (Next.js 14, Redux, **Supabase for project data**). Delete everything that isn't a portfolio. Make it work on phones. Host it on GitHub Pages.

## Owner details

- **Name:** Jawad Adit Chowdhury
- **GitHub:** https://github.com/FishLeAdit
- **LinkedIn:** https://www.linkedin.com/in/jawad-adit-chowdhury-b24b53239
- **CV:** `JawadLatest_CV.pdf` (in the parent folder, to replace `public/englishCV.pdf`)

## Final desktop

Only these icons remain:

| Icon | Opens |
|---|---|
| **Projects** (folder) | One icon per row in the Supabase `Project` table: Stackwise, ECOTRACK, Brain Tumor Segmentation. Double-clicking a project opens it as a folder, the template's existing behaviour (see below). |
| **My Resume** (notepad icon, `/notepad.png`) | `JawadLatest_CV.pdf` in the template's Document Viewer. Copy the PDF to `public/JawadLatest_CV.pdf`. |
| **Contact me** (modem icon, already in the template) | Email, GitHub, LinkedIn. |

Optional, to decide later: keep **Recycle Bin** and **My Computer** as decor. The default is to remove both.

The taskbar, Start menu, clock, window dragging, minimize/maximize/close and the boot screen stay.

### Inside a project (the template's behaviour, kept)
`project-container.tsx` already renders an opened project as a folder of files. We keep it and trim it:

| File icon | Source | Action |
|---|---|---|
| `README.md` | `github_url` | Opens the repo's README in the Document Viewer (the template's `markdown-viewer` + `README-api.ts` already fetch READMEs from GitHub). |
| `<name>` (internet file icon) | `deployment_url` | Opens the live site in a new tab. |
| `<name>` (GitHub file icon) | `github_url` | Opens the repo in a new tab. |
| `Image 1..n` | `images[]` | Opens screenshots in the template's Image Viewer. |
| `Write-up.htm` (**new**) | `writeup` column | Opens the in-app 90s page (only for Brain Tumor Segmentation). |
| ~~VS Code~~ | | **Removed** (part of the bloat). |

## Content

### Stackwise
- Live: https://stackwise-client-ruddy.vercel.app (found in its README)
- Blurb: MERN financial management app for freelancers and small teams (subscriptions, income and expenses, cash flow, client profitability, tax reports, teams, payments). CSE 471 course project.

### ECOTRACK
- Live: https://ecotrack-470-project.vercel.app/
- Blurb: to be written from `ECOTRACK-470PROJECT-main/frontend/README.md` and the backend routes. It's a Node/Express backend plus a frontend, CSE 470 project.

### Brain tumor segmentation (the 90s write-up page)
Source: the thesis `T2520836_Automated_3D_Segmentation_of_Pediatric_Brain_Tumors_Using_Deep_Learning` (LaTeX chapters, figures, learning curves) and the PDF next to it.
The project row lives in Supabase like the others. The **write-up page itself is a React component in the codebase**, not in the database: long-form content with images and tables is easier to build, style and version in code. The row's `writeup = 'brain-tumor'` value tells the project folder to show the `Write-up.htm` icon.

The page opens inside the template's Internet Explorer window. Style: beveled boxes, tiled background, marquee header, "Under Construction" flair, visitor counter, Times / Comic-style fonts, horizontal rules, table layouts. Keep it readable.

Sections, mapped from the thesis:
1. **Welcome / abstract**: the problem (pediatric brain tumors, 3D MRI segmentation).
2. **The data**: dataset, preprocessing.
3. **How we did it**: architecture (3D U-Net variants, attention), training setup, loss, augmentation. Reuse the diagrams (`2..1.drawio.png`, `4.2.drawio.png`, `5.5.drawio.png`).
4. **Results**: Dice scores and comparison tables, plus `attention_thesis_learning_curves.png`. Numbers are copied from the thesis, not paraphrased.
5. **Conclusions and future work**.
6. **Links**: the full thesis PDF (opens in Document Viewer), team and supervisor credits.

Assets go in `public/brain-tumor/`: only the figures actually used, compressed. Don't ship LaTeX sources.

## Supabase design

### Table
The template queries `supabase.from("Project").select()` and types rows as `Project` in `src/types/index.d.ts`. We keep the table name and existing columns, and make two changes:
- `type` becomes `WEB | RESEARCH` (was `FRONTEND | BACKEND`, the slice also expects `MOBILE`). It only picks the folder icon now, since all projects go into one folder.
- New nullable column `writeup` (text).

```sql
create table public."Project" (
  id              bigint generated always as identity primary key,
  name            text    not null,
  description     text    not null,
  done            boolean not null default true,
  images          text[]  not null default '{}',
  deployment_url  text,
  github_url      text,              -- nullable now: the thesis may not have a public repo
  date            date    not null,
  type            text    not null check (type in ('WEB', 'RESEARCH')),
  writeup         text               -- e.g. 'brain-tumor'; null for normal projects
);

-- The anon key ships inside the public JS bundle. RLS makes it read-only.
alter table public."Project" enable row level security;
create policy "Public read" on public."Project" for select to anon using (true);
-- No insert/update/delete policies: only you (via the dashboard) can change data.
```

Then insert the 3 rows from the dashboard's Table Editor.

Screenshots for `images[]`: upload to a **public Supabase Storage bucket** (e.g. `project-images`) and paste the public URLs into the row. Or leave the array empty.

### Keys and env vars
The template's env names are misleading. `NEXT_PUBLIC_API_KEY` holds the **project URL**, and `NEXT_PUBLIC_ANON_KEY` holds the anon key. Keep the names (to avoid touching more code) and document it in `.env.EXAMPLE`.
- Use only the **anon/publishable** key. **Never** the `service_role` key: anything prefixed `NEXT_PUBLIC_` is visible to every visitor.
- Locally: `.env.local` (gitignored). In GitHub: two repository **Actions secrets**, passed as env to the build step.

### Free-tier pausing
Free Supabase projects pause after ~7 days with no API traffic. Two guards:
1. **Keep-alive workflow:** `.github/workflows/keep-alive.yml` runs on a schedule (e.g. every 3 days) and `curl`s the REST endpoint (`/rest/v1/Project?select=id&limit=1` with the anon key). Caveat: GitHub disables scheduled workflows in a repo after 60 days with no commits, and emails you first. Re-enable with one click.
2. **Graceful failure:** if the fetch fails, the Projects folder shows a Win98 error dialog ("Unable to reach the server") instead of an empty window. The template's `message-container.tsx` already handles the `rejected` state, so reuse it.

## Steps

### Phase 0: Baseline (in progress)
1. ✅ `npm install` (Node 22). Done. `npm audit` reports 38 issues, mostly in packages removed in Phase 2. Re-check after.
2. ✅ `npm run dev` returns HTTP 200, but only with a placeholder `.env.local`. Without env vars the template **crashes on load** (`supabaseUrl is required`), because `createClient` runs at import time.
3. Make `98.portfolio` its own git repo: remove the original author's `.git`, `git init`, initial commit.

### Phase 1: Supabase setup
4. **You:** create a free Supabase project (supabase.com, sign in with GitHub). Copy the Project URL and anon key from Settings → API.
5. **You:** run the SQL above in the SQL Editor. Insert the 3 project rows. Optionally upload screenshots to a public Storage bucket.
6. **Me:** put the real values in `.env.local`. Update `.env.EXAMPLE` to list both vars with comments.
7. **Me:** update the `Project` type (`WEB | RESEARCH`, nullable `github_url`, `writeup`). Change `projects-slice.ts` from `frontend/backend/mobile` buckets to a single `projects` list.
8. **Me:** make `src/lib/services/supabase/client.ts` not crash when env vars are missing. Create the client lazily, and have the thunk reject with a clear message. A missing secret then shows the error dialog instead of a white screen.
9. **Me:** remove `@supabase/ssr` (installed but never imported).
10. Verify: the Projects folder lists the 3 rows from Supabase in `npm run dev`.

### Phase 2: Strip the bloat
Remove each item with all its references: `constants/index.ts` (`programs`, `folders`, `allMobileApps`), `window-content-router.tsx`, Redux slices, dock/start-menu entries, mobile app list.

| Remove | Notes |
|---|---|
| `programs/DOOM/` and `doom.png`, `98.doom.png`, `sprites/` | largest chunk |
| `programs/winamp/` and `src/app/api/oembed/` | the oembed route is Winamp-only, and a dynamic API route **blocks static export** |
| `programs/paint/` | |
| `programs/display-properties/` (screensavers, `three` usage) | plus `use-iddle.ts`, `use-screen-saver-exit.ts` |
| `programs/control-panel.tsx`, Keyboard, Mouse, Date/Time, System, Display | |
| `programs/vscode/`, Calculator, Notepad program | also remove the `<VSCode>` trigger and `toGithub1sUrl` usage from `project-container.tsx` |
| `programs/my-computer/` | unless kept as decor |
| `clippy/` and `clippy-slice.ts`, `use-clippy.ts`, gifs | |
| `desktop/monitor-two-init.tsx`, `shared/monitor-receiver.tsx`, `use-monitor.ts` | the 3D monitor intro, and the `monitor2-open-app` listener in `page.tsx` |
| Terminal and `terminal/data.ts` (Miku ASCII, fake files) | |
| Games, Backend, Frontend, Mobile folders, Recycle Bin | replaced by the single Projects folder |
| `themes/` and `settings-slice` options that only served removed features | check first, the wallpaper may depend on it |
| Unused `public/` assets | grep before deleting. Keep `cursors/` and one wallpaper. |

**Kept on purpose:** Document Viewer (CV, READMEs), Image Viewer (project screenshots), Internet Explorer frame (write-up page), so `react-pdf`, `react-markdown`, `remark-gfm`, `github-markdown-css` and `embla-carousel-*` stay.

Packages to remove: `three`, `@types/three`, `gsap`, `@gsap/react`, `youtube-player`, `@types/youtube-player`, `react-day-picker` and `date-fns` (if the clock doesn't use them), `axios` (if unused). Run `npm run build` after removing to catch dangling imports.

### Phase 3: Sound
11. Reduce `sound-manager.tsx` to two sounds: `startup` and `click`.
12. `windows-98-startup.mp3` exists. **There is no click sound in the repo.** The other files `sound-manager` references (shutdown, error, ding, etc.) are missing too. Add a short royalty-free `click.mp3` and play it on icon, taskbar and window-button clicks.
13. Delete `vintage-hard-drive.mp3` and the unused sound entries.
14. Browsers block autoplay. Play the startup sound on the first user interaction (a "click to start" step on the boot screen), never before.

### Phase 4: Build the new content
15. Folders in `constants/index.ts`: `Projects`, `My Resume`, `Contact me`.
16. `window-content-router.tsx`: route `Projects` to `ProjectContainer` with the single list from the slice.
17. `project-container.tsx`: project icon by `type` (WEB → `frontend-icon.png` or similar, RESEARCH → a book/document icon). Add the `Write-up.htm` file when `writeup` is set. Hide the GitHub and README files when `github_url` is null.
18. Brain-tumor page: `src/components/programs/brain-tumor-page/`, rendered in the IE window frame, with a `writeup` key → component map.
19. Contact me window: email, GitHub, LinkedIn, plus a CV download.
20. Replace every "Alexandre Dresch" string and link (`layout.tsx`, `start-screen.tsx`, `welcome-message.tsx`, `dock.tsx`, the about dialog if it survives). Update the page title and description. Replace the `/AlexandreDresch/98.portfolio` document path and `englishCV.pdf`.
21. Update `README.md`, including the Supabase setup SQL so the repo is reproducible. Credit the original template author. **Check for a LICENSE file before publishing.**

### Phase 5: Mobile responsiveness
**Principle:** desktop (1024px and up) stays the faithful Win98 template. Mobile gets its own layout that shares the same data and content. Nothing on PC changes to accommodate phones.

The template already does this. `use-is-desktop.ts` switches at **1024px** between `DesktopLayout` (draggable windows, taskbar, Start menu) and `MobileLayout` (phone-style launcher with status bar, clock widget, app icons, "all apps" and "recent apps" drawers, full-screen `mobile-window`). We keep that and fix what the trimming would break.

- **M1. Fix the hard-coded lists.** `mobile-layout.tsx` looks folders up by name with a non-null assertion (`folders.find(...)!`) from `["Recycle Bin", "My Computer", "Backend", "Frontend"]`, `utilities`, `documents`. Once those folders are gone it will crash. Rewrite to `["Projects", "My Resume", "Contact me"]`, trim `allMobileApps` to the same three, and replace `!` with a safe filter.
- **M2. One data path.** `mobile-window.tsx` dispatches `getProjectsData()` on its own, and so does `dock.tsx`. Fetch once (skip if status isn't `initial`), so switching layouts doesn't double-insert projects.
- **M3. Resume on a phone.** Scale the `react-pdf` viewer to the container width and add a visible "Download CV" fallback button.
- **M4. Brain-tumor page on a phone.** Mobile-first: single column under ~640px, no fixed pixel widths, scrollable or stacked tables, `max-width: 100%` images, bigger tap targets. Keep the 90s look at every size, and make sure the marquee doesn't cause horizontal scroll.
- **M5. Projects on a phone.** The project folder opens full-screen with a back button (the existing `mobile-window` pattern). Live and GitHub links open in a new tab.
- **M6. Touch rules.** Nothing may depend on hover, right-click or drag. Tap targets at least 44px. Respect the safe-area insets (notch and home bar). Use `100dvh` instead of `100vh` so the collapsing address bar doesn't clip the layout.
- **M7. Mobile boot and sound.** Keep `boot-animation` short. Startup sound waits for the first tap.
- **M8. Widths.** Test at 360, 390, 768, 820, 1024 and 1440px.
- **M9. Resize and rotate.** `useIsDesktop` listens for changes, so layouts swap on rotate or resize. Verify that state survives.
- **M10. First paint.** `page.tsx` returns `null` until the media query runs, and a static export's HTML would be empty. Show the boot or splash screen instead of a white page.

### Phase 6: QA
22. `npm run lint` and `npm run build` with zero errors.
23. Manual pass at all M8 widths (a real phone if possible): boot, both sounds, open/close/minimize/maximize, every project file (README, live, GitHub, images, write-up), the CV, Contact me.
24. **Failure test:** wrong anon key, then confirm the Projects folder shows the error dialog and nothing else breaks.
25. Record bundle size before and after the Phase 2 cleanup.

### Phase 7: Deploy to GitHub Pages
Static export works with Supabase: the data is fetched **in the browser** at runtime, and the URL and key are baked in at build time. The only server code, `api/oembed`, is deleted in Phase 2.

26. Repo name decides the URL:
    - **`FishLeAdit.github.io`** gives `https://fishleadit.github.io/`. No `basePath`. **Recommended.**
    - Any other name (e.g. `portfolio`) gives `https://fishleadit.github.io/portfolio/` and needs `basePath`. It also breaks the many hard-coded `"/folder.png"`, `"/soundtrack/..."` paths used by plain `<img>`, `Audio()` and CSS `url()`.
27. `next.config.js`: add `output: 'export'` and `images: { unoptimized: true }` (37 files use `next/image`, and Pages has no optimizer). Replace `remotePatterns` (Google) with nothing: unoptimized images load any URL, including Supabase Storage. Keep the `canvas: false` alias for `react-pdf`.
28. Check the PDF worker (`pdfjs.GlobalWorkerOptions.workerSrc`) in the exported build (`npx serve out`). It's the most likely thing to break.
29. **GitHub secrets:** add `NEXT_PUBLIC_API_KEY` (Supabase URL) and `NEXT_PUBLIC_ANON_KEY` under Settings → Secrets and variables → Actions.
30. `.github/workflows/deploy.yml`: on push to `main`, run `actions/checkout`, `setup-node` (22), `npm ci`, `npm run build` (with the two secrets as `env`), `upload-pages-artifact` (`out/`), then `deploy-pages`. Set Settings → Pages → Source to "GitHub Actions". Add an empty `public/.nojekyll`.
31. `.github/workflows/keep-alive.yml`: the Supabase ping from the design section.
32. Optional: custom domain via `public/CNAME`.

Changing a project later means editing the row in the Supabase dashboard. **No redeploy needed.** Only code or write-up changes need a push.

## Open items (need your input)

1. **Email address** for Contact me. (`fishyadit@gmail.com` is on your Claude account. Confirm it's the one you want public.)
2. **GitHub repo URLs** for Stackwise and ECOTRACK (for the README.md and GitHub files). Is there a public repo for the thesis?
3. **Repo name:** `FishLeAdit.github.io` (recommended) or another name with a `/subpath`.
4. **Brain tumor page:** OK to use thesis text and figures verbatim? Collaborators or a supervisor to credit?
5. **Screenshots:** want any per project (Supabase Storage), or keep `images` empty?
6. **Recycle Bin and My Computer:** keep as decor or remove (default: remove)?
7. **Click sound:** you pick one, or I source a royalty-free one.
8. **Template license:** I'll check before deploying and credit the original.

## Order of work

0 → 1 → 2 → 3 → 4 → 5 → 6 → 7. Build and commit at the end of each phase, so a break is easy to bisect.
Phase 1 steps 4-5 are yours (Supabase account and SQL). Everything else I can do.
