import { AppStateProvider } from '../../components/app/AppState';
import AppShell from '../../components/app/AppShell';
import '../app.css';

// Shell for every signed-in page: dashboard, profile, projects, services, trust, settings.
// TODO when auth is connected: check the session here (server-side) and redirect to /login when there is none.
// Marketing chrome is hidden for these routes by components/SiteChrome.jsx (see BARE_ROUTES in lib/siteConfig.js).
export default function AppLayout({ children }) {
  return (
    <AppStateProvider>
      <AppShell>{children}</AppShell>
    </AppStateProvider>
  );
}
