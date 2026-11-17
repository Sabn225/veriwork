# VeriWork: Upwork-style "Find projects" menu and Browse page

## Installing
Unzip into your project root so the files merge into `src/`. Same rules as the last drop: merge, do not delete folders first.
No new dependencies. Plain CSS only. Nothing in `/public` is touched.

If you changed `lib/dictionary.js` since the last zip, do not overwrite it. The only change is three lines:
1. add `import { MENU_EN, MENU_VI } from './dictionary.menu.js';` under the existing import
2. change `...APP_EN` to `...APP_EN, ...MENU_EN`
3. change `...APP_VI` to `...APP_VI, ...MENU_VI`

**Route check:** this adds one public route, `/browse`. If your project already has a page there, keep yours and move the pieces you want.

## What you get

**1. Header menus (the thing in your screenshot)**
- **Find projects**: categories on the left, the selected category's subcategories on the right (name plus one line), quick links along the bottom (See all projects, Build your profile, How verification works).
- **Why VeriWork**: a short dropdown holding How it works, Credential and Trust system, each with one line of explanation.
- Opens on mouse hover or on click. Closes on Escape (focus goes back to the button), on a click or focus outside, and on page change. Hovering then clicking keeps it open.
- Keyboard: Up/Down/Home/End move between categories, Tab goes straight into that category's subcategories.
- Touch devices and screens under 1080px use the existing slide-down menu, now with two accordions.

**2. Browse projects page (`/browse`)**: where every menu link lands.
- Filters: category, subcategory, project type (fixed or hourly), skill, search. All of them live in the URL (`/browse?category=writing&sub=copywriting&type=hour`), so views can be shared and the Back button works.
- Counts beside each filter are real (they follow the other active filters). Skill tags on each project are click-to-filter.
- Breadcrumb, heading and description follow the selection. Search ignores accents ("thiet ke" finds "thiết kế").
- Wide screens: filters in a sticky side column. Small screens: filters become scrolling rows of pills above the results.
- Unknown values in the URL are ignored, never an error.

**3. Smaller changes**
- Home-page project explorer: "Browse all projects" button. Footer "Explore Projects" now opens `/browse`.
- All new copy is in English and Vietnamese (`dictionary.menu.js`), 383 keys per language, exact parity.

## Files
**New:** `components/MegaMenu.jsx`, `lib/categories.js`, `lib/dictionary.menu.js`, `app/browse/page.jsx`, `app/browse/browse.css`
**Changed:** `components/Navbar.jsx`, `components/Footer.jsx`, `components/ProjectExplorer.jsx`, `app/layout.css`, `app/landing.css`, `lib/dictionary.js` (3 lines)

## Things to know
- **Navigation changed.** The bar is now Home, Find projects, Why VeriWork. Credential, How it works and Trust system moved inside "Why VeriWork" (same targets, scrollspy still highlights it). The old "Explore Projects" link became the Find projects menu.
- **The menu structure is `lib/categories.js`.** Each subcategory is a set of skills; a project belongs to it when it lists one of them. Every subcategory currently matches at least one sample project, so no menu link lands on an empty page. To add a category, add it there, add its `cat.<key>` name to the dictionary, and add the key to `PROJECT_CATEGORIES`.
- Results still come from the labelled sample data in `lib/sampleProjects.js`. "Sign up to apply" goes to `/signup`, as on the home page.
- `/browse` uses the marketing navbar and footer (it is not in `BARE_ROUTES`).

## Deliberately not built
- **Hire students menu.** Sign up has no client or student choice and there is no project-posting flow, so a menu would lead nowhere. Needs a decision on client accounts first.
- **"Win work with ads" and the "NEW" banner from the screenshot.** Paid promotion and an announcement are Upwork's own; there is nothing real behind either here.

## What was tested
- Production build (`next build`, 13 routes including `/browse`); the built server returns 200 for `/` and `/browse` with the menu markup.
- 28 automated component tests (jsdom): menu open/close, hover and click, Escape and focus return, outside click, arrow-key navigation, moving quickly from one menu to the other, mobile accordion, Vietnamese labels; browse filters from the URL, honest counts, invalid URL values, empty state, debounced search, skill tags, details toggle.
- en/vi dictionary parity.

**Not tested:** how it looks. There was no real browser available, so spacing, the panel position under the header, dark mode and the mobile layout have not been seen on screen, and neither have Safari/Firefox, touch devices or screen readers. Please open it once in light and dark mode at desktop and phone width; tell me what looks off and I will fix it.
