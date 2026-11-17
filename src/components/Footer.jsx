'use client';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';

// Only links that lead somewhere real. The Company / Legal / social columns were removed because
// their targets (#about, #privacy, #linkedin ...) did not exist. Their translation keys are still in dictionary.js.
export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-main">

        <div className="footer-brand">
          <Link href="/" className="footer-brand-link">
            <img src="/logo-icon.png" alt="VeriWork Icon" className="logo-img" />
            <span>VeriWork</span>
          </Link>
          <p className="footer-desc">{t('footer.desc')}</p>
        </div>

        <nav aria-label="Product">
          <h2 className="footer-title">{t('footer.product')}</h2>
          <ul className="footer-links">
            <li><Link href="/#features">{t('nav.features')}</Link></li>
            <li><Link href="/#how-it-works">{t('nav.howItWorks')}</Link></li>
            <li><Link href="/#credential">{t('nav.credential')}</Link></li>
            <li><Link href="/browse">{t('nav.exploreProjects')}</Link></li>
            <li><Link href="/#trust">{t('nav.trustSystem')}</Link></li>
          </ul>
        </nav>

        <nav aria-label="Account">
          <h2 className="footer-title">{t('footer.account')}</h2>
          <ul className="footer-links">
            <li><Link href="/login">{t('auth.login')}</Link></li>
            <li><Link href="/signup">{t('auth.signup')}</Link></li>
          </ul>
        </nav>

      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            &copy; <span>{currentYear}</span> VeriWork. <span>{t('footer.rights')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
