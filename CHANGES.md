# VeriWork redesign: landing page, app workspace and auth screens

## Installing

This zip is laid out for a project that uses a `src/` folder (`src/app`, `src/components`, `src/lib`). Unzip it into your project root so the files merge into those folders.
**Merge, do not replace**: do not delete your existing `src/lib` or `src/components` first. `src/lib/LanguageContext.jsx` is included (identical to yours) so it cannot go missing.
If your project has no `src/` folder, move the contents of `src/` up one level; every import is relative, so nothing else changes.

No new dependencies. Nothing in `/public` is touched. Plain CSS only (no Tailwind/Bootstrap).

## Read this first: what is and is not connected

| Area | State |
|---|---|
| Landing page | Finished. Real content, no fabricated testimonials, partners or numbers. |
| Auth screens (login, sign up, forgot, reset) | **UI finished, backend not connected.** Every form calls one file, `lib/auth.js`. Until you implement it, each form shows an honest "not connected" message. Nothing pretends to sign you in. |
| App pages (dashboard, profile, projects, services, trust, settings) | **UI finished, running on labelled sample data held in memory.** Edits work inside the tab and are lost on reload. A "Sample data" strip is shown under the top bar while `APP_PREVIEW = true` in `lib/siteConfig.js`. |
| Route protection | **Not done.** The app pages are open to anyone. Add the session check in `app/(app)/layout.jsx` (there is a TODO). |
| Trust Score | Illustrative only. The scoring system is not implemented, and the page says so in a notice. Identity verification is shown as "not available yet" with no link. |

## Before you drop it in: possible route collisions

The new routes are `/dashboard /profile /projects /services /trust /settings /login /signup /forgot-password /reset-password`.
If your project already has pages at any of these paths, Next will refuse to build ("two parallel pages resolve to the same path").
Keep your existing logic: move the new markup into your page, or delete the new `page.jsx` and keep yours.
The list of routes that hide the marketing navbar/footer is `BARE_ROUTES` in `lib/siteConfig.js`.

## Connecting your backend

1. **`lib/auth.js`**: replace each function body with your API call (an example is in the file). Throw `withCode('INVALID_CREDENTIALS' | 'EMAIL_TAKEN' | 'INVALID_TOKEN')` to get a specific translated message; anything else shows a generic one.
2. **Sample data to real data**: `lib/sampleApp.js` (profile, services, applications, activity, trust factors) and `lib/sampleProjects.js` (listings). `components/app/AppState.jsx` is the in-memory store; swap its reducer actions for API calls.
3. Set `APP_PREVIEW = false` in `lib/siteConfig.js` to remove the preview strip.
4. Add the session guard in `app/(app)/layout.jsx`.

## Files

**New**

| File | Purpose |
|---|---|
| `app/(app)/layout.jsx` | Shell for signed-in pages (state provider + top bar + sidebar) |
| `app/(app)/{dashboard,profile,projects,services,trust,settings}/page.jsx` | The six app pages |
| `app/(auth)/layout.jsx` | Frame for the auth screens |
| `app/(auth)/{login,signup,forgot-password,reset-password}/page.jsx` | The four auth screens |
| `app/app.css`, `app/auth.css`, `app/ui.css` | App, auth and shared-primitive styles |
| `components/SiteChrome.jsx` | Shows navbar/footer on marketing routes only |
| `components/LangSwitch.jsx` | Your language menu, moved out of `Navbar.jsx` unchanged so the app and auth can reuse it |
| `components/Field.jsx` | Labelled input/textarea/select with hint, error and password show/hide |
| `components/app/{AppShell,AppState,Common,Dialog,FormDialog,Tabs}.jsx` | Shell, in-memory state, shared bits, accessible dialog/drawer, config-driven form dialog, accessible tabs |
| `components/auth/{AuthShell.jsx,authErrors.js}` | Auth frame, error-code to message mapping |
| `components/{HowItWorks,ProjectExplorer}.jsx` | Landing timeline and project explorer |
| `lib/auth.js` | **The one file to connect** |
| `lib/siteConfig.js` | `HERO_VIDEO`, `APP_PREVIEW`, `BARE_ROUTES` |
| `lib/sampleApp.js`, `lib/sampleProjects.js` | Labelled sample data |
| `lib/dictionary.app.js` | en/vi copy for the app and auth (merged into the dictionary) |
| `lib/usePageTitle.js` | Translated `document.title` for client pages |

**Changed**

| File | Change |
|---|---|
| `app/globals.css` | New token set (light + genuinely designed dark), spacing scale, buttons, skip link, status colours, `--primary-ink` for text on tints |
| `app/layout.css`, `app/landing.css`, `app/page.jsx` | Landing redesign |
| `app/layout.jsx` | Imports `ui.css`/`layout.css`, wraps children in `SiteChrome`. The pre-paint theme/language script is unchanged |
| `components/Navbar.jsx` | New nav, scrollspy, skip link. `LangSwitch` moved to its own file |
| `components/Footer.jsx` | See "Removed" |
| `components/HeroVideo.jsx` | Reads the video from `lib/siteConfig.js` |
| `components/ThemeToggle.jsx` | **Behaviour change**: it now follows `data-theme` changes made elsewhere (Settings → Appearance) and reads the live value when toggling. Same storage key and pre-paint behaviour |
| `lib/dictionary.js` | All existing keys kept; 360 keys per language with exact en/vi parity; app copy merged from `dictionary.app.js` |

`lib/LanguageContext.jsx` is included but unchanged from your file.

## Preserved

- Theme system: pre-paint script, `veriwork-theme` key, OS preference fallback.
- Language system: `LanguageContext`, `veriwork-lang` key, `t()` fallback chain.
- CSS 3D credential tilt, CTA float animation, 16:9 video frame, `prefers-reduced-motion` handling.
- All existing translation keys, including footer keys that are no longer rendered.

## Removed (say so if you want any restored)

- Footer **Company / Legal columns and social links**. Their targets were bare anchors (`#about`, `#privacy`, `#linkedin`, ...) that went nowhere. Restore them once real pages exist; the translation keys are still in the dictionary.

## Replacing the hero video

Put the file in `/public/media/` and set `HERO_VIDEO = { src: '/media/hero.mp4', poster: '/media/hero-poster.jpg' }` in `lib/siteConfig.js`.

## Behaviour worth knowing

- **Verified vs self-declared** is a label plus a shape (check / dashed ring / half ring), never colour alone. Entries you add start as self-declared. "Request verification" moves an entry to "In review"; nothing in this preview actually reviews it. Verified and in-review entries cannot be edited.
- **Profile photo** is a local preview only (not uploaded).
- **Forgot password** shows the same message whether or not an account exists, so the form cannot be used to look up accounts.
- **Settings → Appearance** has Light / Dark / System. System follows the OS live and removes the saved choice.
- **Links typed into portfolio items** are only rendered as links when they are `http(s)`.

## What was tested

Production build (`next build`, 11 routes) and a scripted browser pass against it (Chrome via Playwright):

- 31 landing checks (theme, search/filter, scrollspy, timeline, EN/VI, reduced motion, no overflow) and 184 app/auth checks: every route in both themes at 390/768/1024/1280 px (correct chrome, no console errors, no horizontal scroll, no raw translation keys), every route in Vietnamese, plus the flows: add/edit/remove entries, request verification, skills, photo preview, save/apply/withdraw, services create/pause/edit, settings tabs/theme/language, all four auth forms' validation and "not connected" handling, dialog focus trap / Escape / focus return, tab keyboard navigation, mobile drawer, skip link, account menu.
- axe-core (WCAG 2.0/2.1 A and AA + best practices): 0 violations across 36 page states (all routes, both themes, open dialog with errors, open drawer, open menu).
- en/vi dictionary parity and a scan confirming every `t('…')` key exists.

**Not tested:** your real `public/` folder and any existing routes; any real backend; Safari and Firefox; screen readers (automated axe only); real devices; the hero video (no file was supplied).
