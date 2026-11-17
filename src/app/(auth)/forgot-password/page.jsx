'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { requestPasswordReset } from '../../../lib/auth';
import TextField from '../../../components/Field';
import { authErrorMessage, isEmail } from '../../../components/auth/authErrors';

export default function ForgotPasswordPage() {
  usePageTitle('auth.forgotTitle');
  const { t } = useLanguage();
  const formRef = useRef(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError(t('err.email'));
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setAlert('');
    setBusy(true);
    try {
      await requestPasswordReset({ email: email.trim() });
      // Same message whether or not the account exists, so this form cannot be used to look up who has an account.
      setDone(true);
    } catch (err) {
      setAlert(authErrorMessage(err, t));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="auth-title">{t('auth.forgotTitle')}</h1>
      <p className="auth-lead">{t('auth.forgotLead')}</p>

      {done ? (
        <div className="auth-form">
          <p className="form-alert" data-tone="success" role="status">{t('auth.forgotDone')}</p>
          <Link className="btn btn-secondary btn-lg" href="/login">{t('auth.backToLogin')}</Link>
        </div>
      ) : (
        <>
          <form className="auth-form" noValidate onSubmit={submit} ref={formRef}>
            {alert && <p className="form-alert" data-tone="error" role="alert">{alert}</p>}
            <TextField type="email" name="email" label={t('auth.email')} value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} error={error} required autoComplete="email" inputMode="email" />
            <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>{busy ? t('auth.wait') : t('auth.forgotSubmit')}</button>
          </form>
          <p className="auth-alt"><Link href="/login">{t('auth.backToLogin')}</Link></p>
        </>
      )}
    </>
  );
}
