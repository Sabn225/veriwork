// Single place to swap the hero video.
// 1. Put the files in /public (for example /public/media/hero.mp4).
// 2. Set the paths below. Leave `src` empty to keep the "coming soon" placeholder.
export const HERO_VIDEO = {
  src: '/media/hero.mp4',
  poster: '/media/hero-poster.jpg',   // chưa có poster thì để ''
};
// The app workspace (dashboard, profile, projects, services, trust, settings) runs on sample data held in memory.
// While this is true, a slim "preview" notice is shown under the top bar. Set it to false once the pages read real data.
export const APP_PREVIEW = true;

// Routes that use the app shell or the auth layout instead of the marketing navbar and footer.
export const BARE_ROUTES = ['/dashboard', '/profile', '/projects', '/services', '/trust', '/settings', '/login', '/signup', '/forgot-password', '/reset-password'];
