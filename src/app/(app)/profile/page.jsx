'use client';
import { useRef, useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { SAMPLE_REFERENCE, loc } from '../../../lib/sampleApp';
import { useApp } from '../../../components/app/AppState';
import { Avatar, Icon, PageHeader, Progress, Section, StatusBadge } from '../../../components/app/Common';
import Dialog from '../../../components/app/Dialog';
import FormDialog from '../../../components/app/FormDialog';
import TextField from '../../../components/Field';

// Links typed by the user are only shown as links when they are http(s).
const toUrl = (v) => (!v ? '' : /^https?:\/\//i.test(v) ? v : `https://${v}`);
const isHttp = (v) => /^https?:\/\//i.test(v || '');

export default function ProfilePage() {
  usePageTitle('app.nav.profile');
  const { t, language } = useLanguage();
  const { state, dispatch, completion, counts } = useApp();
  const L = (v) => loc(v, language);

  const [dlg, setDlg] = useState(null);       // { kind: 'profile' | list name, id?: string }
  const [removing, setRemoving] = useState(null); // { list, id, title }
  const [photoError, setPhotoError] = useState('');
  const [skill, setSkill] = useState('');
  const [skillError, setSkillError] = useState('');
  const [live, setLive] = useState('');
  const fileRef = useRef(null);

  const entries = [...state.experience, ...state.achievements];
  const verified = entries.filter((e) => e.status === 'verified');

  // ----- dialog configuration -----
  const find = (list, id) => state[list].find((i) => i.id === id);
  const editing = dlg && dlg.id ? find(dlg.kind, dlg.id) : null;
  const sectionName = { experience: t('prof.experience'), education: t('prof.education'), portfolio: t('prof.portfolio'), achievements: t('prof.achievements') };
  const addTitle = { experience: t('prof.addExperience'), education: t('prof.addEducation'), portfolio: t('prof.addPortfolio'), achievements: t('prof.addAchievement') };

  const listForm = (kind) => {
    const fields = {
      experience: [
        { name: 'title', label: t('form.title'), required: true },
        { name: 'org', label: t('form.organization'), required: true },
        { name: 'period', label: t('form.period'), hint: t('form.periodHint') },
        { name: 'description', label: t('form.description'), type: 'textarea', optional: true },
      ],
      education: [
        { name: 'school', label: t('form.school'), required: true },
        { name: 'degree', label: t('form.degree'), required: true },
        { name: 'period', label: t('form.period'), hint: t('form.periodHint') },
      ],
      portfolio: [
        { name: 'title', label: t('form.title'), required: true },
        { name: 'description', label: t('form.description'), type: 'textarea', optional: true },
        { name: 'link', label: t('form.link'), optional: true, placeholder: 'https://' },
      ],
      achievements: [
        { name: 'title', label: t('form.title'), required: true },
        { name: 'year', label: t('form.year'), optional: true },
      ],
    }[kind];
    const initial = editing && Object.fromEntries(fields.map((f) => [f.name, L(editing[f.name])]));
    return {
      title: editing ? `${t('common.edit')} · ${sectionName[kind]}` : addTitle[kind],
      submitLabel: editing ? t('common.save') : t('common.add'),
      fields,
      initial,
      onSubmit: (v) => {
        const values = kind === 'portfolio' ? { ...v, link: toUrl(v.link) } : v;
        if (editing) dispatch({ type: 'update', list: kind, id: editing.id, patch: values });
        else dispatch({ type: 'add', list: kind, item: kind === 'experience' || kind === 'achievements' ? { status: 'self', ...values } : values });
      },
    };
  };

  const profileForm = () => ({
    title: t('prof.edit'),
    fields: [
      { name: 'name', label: t('form.name'), required: true },
      { name: 'headline', label: t('form.headline') },
      { name: 'location', label: t('form.location') },
      { name: 'about', label: t('form.about'), type: 'textarea' },
    ],
    initial: { name: state.user.name, headline: L(state.user.headline), location: state.user.location, about: L(state.user.about) },
    onSubmit: (v) => dispatch({ type: 'user', patch: v }),
  });

  const form = dlg ? (dlg.kind === 'profile' ? profileForm() : listForm(dlg.kind)) : null;

  // ----- actions -----
  const onPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { setPhotoError(t('prof.photoError')); return; }
    setPhotoError('');
    if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
    dispatch({ type: 'photo', url: URL.createObjectURL(file) });
  };

  const requestVerification = (list, item) => {
    dispatch({ type: 'update', list, id: item.id, patch: { status: 'pending' } });
    setLive(`${L(item.title)}: ${t('status.pending')}`);
  };

  const addSkill = (e) => {
    e.preventDefault();
    const name = skill.trim();
    if (!name) { setSkillError(t('form.required')); return; }
    if (!state.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      dispatch({ type: 'add', list: 'skills', item: { name } });
    }
    setSkill('');
    setSkillError('');
  };

  const entryActions = (list, item, locked) => (
    <div className="row-actions">
      {!locked && item.status === 'self' && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => requestVerification(list, item)}>{t('prof.requestVerify')}</button>
      )}
      {!locked && (
        <button type="button" className="btn btn-ghost btn-sm" aria-label={`${t('common.edit')}: ${L(item.title || item.school)}`} onClick={() => setDlg({ kind: list, id: item.id })}>{t('common.edit')}</button>
      )}
      <button type="button" className="btn btn-ghost btn-sm" aria-label={`${t('common.remove')}: ${L(item.title || item.school)}`} onClick={() => setRemoving({ list, id: item.id, title: L(item.title || item.school) })}>{t('common.remove')}</button>
    </div>
  );

  const addButton = (kind) => (
    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDlg({ kind })}><Icon name="plus" />{t('common.add')}</button>
  );

  return (
    <>
      <PageHeader
        title={t('app.nav.profile')}
        actions={<button type="button" className="btn btn-primary" onClick={() => setDlg({ kind: 'profile' })}><Icon name="edit" />{t('prof.edit')}</button>}
      />
      <p className="visually-hidden" role="status" aria-live="polite">{live}</p>

      <div className="prof-grid">
        <div className="prof-side side-stack">
          <section className="panel" id="photo" aria-label={t('prof.contact')}>
            <Avatar name={state.user.name} src={state.photoUrl} size={96} />
            <p className="prof-name">{state.user.name}</p>
            <p className="prof-headline">{L(state.user.headline)}</p>
            <ul className="prof-meta">
              {state.user.location && <li>{state.user.location}</li>}
              <li>{state.user.email}</li>
            </ul>
            <div className="photo-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current && fileRef.current.click()}><Icon name="camera" />{t('prof.changePhoto')}</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
            </div>
            <p className="photo-note">{t('prof.photoNote')}</p>
            {photoError && <p className="form-error" role="alert">{photoError}</p>}
          </section>

          <section className="panel" aria-labelledby="pc-h">
            <h2 className="panel-title" id="pc-h">{t('dash.completion')}</h2>
            <p className="stat-big">{completion.pct}<small>%</small></p>
            <Progress value={completion.done} max={completion.total} label={t('dash.completion')} />
            <p className="panel-note">{completion.done} / {completion.total} {t('dash.steps')}</p>
          </section>
        </div>

        <div className="stack">
          <Section id="about" title={t('prof.about')} action={<button type="button" className="btn btn-ghost btn-sm" onClick={() => setDlg({ kind: 'profile' })}>{t('common.edit')}</button>}>
            <p className="about-text">{L(state.user.about)}</p>
          </Section>

          <Section id="experience" title={t('prof.experience')} action={addButton('experience')}>
            {state.experience.length === 0 ? <p className="empty">{t('prof.noExperience')}</p> : (
              <ul className="rows">
                {state.experience.map((x) => (
                  <li key={x.id} className="row">
                    <div className="row-main">
                      <h3 className="row-title">{L(x.title)}</h3>
                      <p className="row-meta">{[L(x.org), x.period].filter(Boolean).join(' · ')}</p>
                      {x.description && <p className="row-text">{L(x.description)}</p>}
                      {entryActions('experience', x, x.status !== 'self')}
                    </div>
                    <div className="row-side"><StatusBadge status={x.status} /></div>
                  </li>
                ))}
              </ul>
            )}
            <p className="locked-note">{t('prof.entryNote')} {t('prof.lockedNote')}</p>
          </Section>

          <Section id="education" title={t('prof.education')} action={addButton('education')}>
            {state.education.length === 0 ? <p className="empty">{t('prof.noEducation')}</p> : (
              <ul className="rows">
                {state.education.map((e) => (
                  <li key={e.id} className="row">
                    <div className="row-main">
                      <h3 className="row-title">{L(e.school)}</h3>
                      <p className="row-meta">{[L(e.degree), e.period].filter(Boolean).join(' · ')}</p>
                      {entryActions('education', e, false)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="skills" title={t('prof.skills')}>
            {state.skills.length > 0 && (
              <ul className="skill-list">
                {state.skills.map((s) => (
                  <li key={s.id} className="skill-chip">
                    {s.name}
                    <button type="button" aria-label={`${t('common.remove')}: ${s.name}`} onClick={() => dispatch({ type: 'remove', list: 'skills', id: s.id })}><Icon name="close" /></button>
                  </li>
                ))}
              </ul>
            )}
            <form className="skill-add" onSubmit={addSkill} noValidate>
              <TextField label={t('prof.addSkill')} name="skill" value={skill} onChange={(e) => { setSkill(e.target.value); setSkillError(''); }} error={skillError} />
              <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'end' }}>{t('common.add')}</button>
            </form>
            <p className="locked-note">{t('prof.skillsHint')}</p>
          </Section>

          <Section id="portfolio" title={t('prof.portfolio')} action={addButton('portfolio')}>
            {state.portfolio.length === 0 ? <p className="empty">{t('prof.noPortfolio')}</p> : (
              <ul className="rows">
                {state.portfolio.map((p) => (
                  <li key={p.id} className="row">
                    <div className="row-main">
                      <h3 className="row-title">{L(p.title)}</h3>
                      {p.description && <p className="row-text">{L(p.description)}</p>}
                      {isHttp(p.link) && (
                        <p className="row-meta"><a className="text-link" href={p.link} target="_blank" rel="noopener noreferrer">{p.link}</a></p>
                      )}
                      {entryActions('portfolio', p, false)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="achievements" title={t('prof.achievements')} action={addButton('achievements')}>
            {state.achievements.length === 0 ? <p className="empty">{t('prof.noAchievements')}</p> : (
              <ul className="rows">
                {state.achievements.map((a) => (
                  <li key={a.id} className="row">
                    <div className="row-main">
                      <h3 className="row-title">{L(a.title)}</h3>
                      {a.year && <p className="row-meta">{a.year}</p>}
                      {entryActions('achievements', a, a.status !== 'self')}
                    </div>
                    <div className="row-side"><StatusBadge status={a.status} /></div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="credentials" title={t('prof.credentials')}>
            {verified.length === 0 ? <p className="empty">{t('prof.noCredentials')}</p> : (
              <ul className="rows">
                {verified.map((v) => (
                  <li key={v.id} className="row">
                    <div className="row-main">
                      <h3 className="row-title">{L(v.title)}</h3>
                      <p className="row-meta">{[v.org && L(v.org), v.period || v.year].filter(Boolean).join(' · ')}</p>
                      <p className="row-meta">{t('cred.ref')} {SAMPLE_REFERENCE}</p>
                    </div>
                    <div className="row-side"><StatusBadge status="verified" /></div>
                  </li>
                ))}
              </ul>
            )}
            <p className="sample-note">{t('cred.sample')} {counts.verified} {t('dash.verifiedCount')}.</p>
          </Section>
        </div>
      </div>

      <FormDialog
        open={!!form}
        onClose={() => setDlg(null)}
        title={form ? form.title : ''}
        fields={form ? form.fields : []}
        initial={form ? form.initial : undefined}
        submitLabel={form ? form.submitLabel : undefined}
        onSubmit={form ? form.onSubmit : () => {}}
      />

      <Dialog open={!!removing} onClose={() => setRemoving(null)} title={t('common.remove')}>
        <div className="dialog-body"><p>{removing && removing.title}</p></div>
        <div className="dialog-foot">
          <button type="button" className="btn btn-secondary" data-autofocus onClick={() => setRemoving(null)}>{t('common.cancel')}</button>
          <button type="button" className="btn btn-danger" onClick={() => { dispatch({ type: 'remove', list: removing.list, id: removing.id }); setRemoving(null); }}>{t('common.remove')}</button>
        </div>
      </Dialog>
    </>
  );
}
