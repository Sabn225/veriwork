'use client';
import { useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { loc } from '../../../lib/sampleApp';
import { useApp } from '../../../components/app/AppState';
import { Icon, PageHeader, StatusBadge } from '../../../components/app/Common';
import FormDialog from '../../../components/app/FormDialog';

export default function ServicesPage() {
  usePageTitle('app.nav.services');
  const { t, language } = useLanguage();
  const { state, dispatch } = useApp();
  const L = (v) => loc(v, language);

  const [dlg, setDlg] = useState(null); // { id: string | null }
  const [live, setLive] = useState('');
  const editing = dlg && dlg.id ? state.services.find((s) => s.id === dlg.id) : null;

  const availability = { open: t('svc.avail.open'), limited: t('svc.avail.limited'), closed: t('svc.avail.closed') };
  const fields = [
    { name: 'title', label: t('svc.name'), required: true },
    { name: 'description', label: t('form.description'), type: 'textarea', required: true },
    { name: 'skills', label: t('svc.skills'), hint: t('svc.skillsHint'), optional: true },
    { name: 'price', label: t('svc.price'), type: 'number', required: true },
    { name: 'deliveryDays', label: t('svc.deliveryDays'), type: 'number', required: true },
    { name: 'availability', label: t('svc.availability'), type: 'select', options: Object.entries(availability).map(([value, label]) => ({ value, label })) },
    { name: 'portfolio', label: t('svc.portfolio'), type: 'checks', hint: t('svc.portfolioHint'), emptyText: t('svc.portfolioNone'), options: state.portfolio.map((p) => ({ value: p.id, label: L(p.title) })) },
  ];
  const initial = editing
    ? { title: L(editing.title), description: L(editing.description), skills: editing.skills.join(', '), price: editing.price, deliveryDays: editing.deliveryDays, availability: editing.availability, portfolio: editing.portfolio }
    : { availability: 'open', portfolio: [] };

  const save = (v) => {
    const data = {
      title: v.title,
      description: v.description,
      skills: v.skills.split(',').map((s) => s.trim()).filter(Boolean),
      price: v.price,
      deliveryDays: v.deliveryDays,
      availability: v.availability,
      portfolio: v.portfolio,
    };
    if (editing) dispatch({ type: 'update', list: 'services', id: editing.id, patch: data });
    else dispatch({ type: 'add', list: 'services', item: { status: 'active', ...data } });
  };

  const toggleStatus = (s) => {
    const next = s.status === 'active' ? 'paused' : 'active';
    dispatch({ type: 'update', list: 'services', id: s.id, patch: { status: next } });
    setLive(`${L(s.title)}: ${t(`status.${next}`)}`);
  };

  return (
    <>
      <PageHeader
        title={t('app.nav.services')}
        lead={t('svc.lead')}
        actions={<button type="button" className="btn btn-primary" onClick={() => setDlg({ id: null })}><Icon name="plus" />{t('svc.new')}</button>}
      />
      <p className="visually-hidden" role="status" aria-live="polite">{live}</p>

      {state.services.length === 0 ? (
        <p className="empty">{t('svc.empty')}</p>
      ) : (
        <ul className="rows">
          {state.services.map((s) => (
            <li key={s.id} className="row">
              <div className="row-main">
                <h2 className="row-title">{L(s.title)}</h2>
                <p className="row-text">{L(s.description)}</p>
                {s.skills.length > 0 && <ul className="tags">{s.skills.map((k) => <li key={k} className="tag">{k}</li>)}</ul>}
                <dl className="facts">
                  <div><dt>{t('svc.from')}</dt><dd>${s.price}</dd></div>
                  <div><dt>{t('svc.delivery')}</dt><dd>{s.deliveryDays} {t('svc.days')}</dd></div>
                  <div><dt>{t('svc.availability')}</dt><dd>{availability[s.availability]}</dd></div>
                  <div><dt>{t('svc.portfolio')}</dt><dd>{s.portfolio.length} {s.portfolio.length === 1 ? t('svc.portfolioOne') : t('svc.portfolioCount')}</dd></div>
                </dl>
                <div className="row-actions">
                  <button type="button" className="btn btn-secondary btn-sm" aria-label={`${t('common.edit')}: ${L(s.title)}`} onClick={() => setDlg({ id: s.id })}>{t('common.edit')}</button>
                  <button type="button" className="btn btn-ghost btn-sm" aria-label={`${s.status === 'active' ? t('svc.pause') : t('svc.resume')}: ${L(s.title)}`} onClick={() => toggleStatus(s)}>
                    {s.status === 'active' ? t('svc.pause') : t('svc.resume')}
                  </button>
                </div>
              </div>
              <div className="row-side"><StatusBadge status={s.status} /></div>
            </li>
          ))}
        </ul>
      )}
      <p className="sample-note">{t('common.sample')}</p>

      <FormDialog
        open={!!dlg}
        onClose={() => setDlg(null)}
        title={editing ? t('svc.edit') : t('svc.new')}
        fields={fields}
        initial={initial}
        submitLabel={editing ? t('common.save') : t('common.add')}
        onSubmit={save}
      />
    </>
  );
}
