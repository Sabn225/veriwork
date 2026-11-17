import AuthShell from '../../components/auth/AuthShell';
import '../auth.css';

// Shared frame for /login, /signup, /forgot-password and /reset-password.
export default function AuthLayout({ children }) {
  return <AuthShell>{children}</AuthShell>;
}
