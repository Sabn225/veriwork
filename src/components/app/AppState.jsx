'use client';
import { createContext, useContext, useMemo, useReducer } from 'react';
import { INITIAL_STATE, loc } from '../../lib/sampleApp';

// In-memory workspace state. It lives in the (app) layout, so it survives navigation between app pages
// but resets on a full reload. When a backend exists, replace the reducer actions with API calls.
export const uid = (prefix = 'n') => `${prefix}${Math.random().toString(36).slice(2, 8)}`;
export const todayISO = () => new Date().toISOString().slice(0, 10);

function reducer(s, a) {
  switch (a.type) {
    case 'user': return { ...s, user: { ...s.user, ...a.patch } };
    case 'add': return { ...s, [a.list]: [{ id: uid(a.list[0]), ...a.item }, ...s[a.list]] };
    case 'update': return { ...s, [a.list]: s[a.list].map((i) => (i.id === a.id ? { ...i, ...a.patch } : i)) };
    case 'remove': return { ...s, [a.list]: s[a.list].filter((i) => i.id !== a.id) };
    case 'toggleSaved': return { ...s, saved: s.saved.includes(a.id) ? s.saved.filter((x) => x !== a.id) : [a.id, ...s.saved] };
    case 'apply': return { ...s, applications: [{ id: uid('ap'), projectId: a.projectId, status: 'submitted', when: a.when, note: a.note }, ...s.applications] };
    case 'withdraw': return { ...s, applications: s.applications.map((x) => (x.id === a.id ? { ...x, status: 'withdrawn' } : x)) };
    case 'photo': return { ...s, photoUrl: a.url };
    case 'pref': return { ...s, prefs: { ...s.prefs, [a.group]: { ...s.prefs[a.group], [a.key]: a.value } } };
    default: return s;
  }
}

// Profile completion: every item is derived from the profile itself, nothing is stored separately.
export function getChecklist(s) {
  const entries = [...s.experience, ...s.achievements];
  return [
    { id: 'photo', done: !!s.photoUrl, key: 'step.photo', href: '/profile#photo' },
    { id: 'about', done: !!loc(s.user.about, 'en').trim(), key: 'step.about', href: '/profile#about' },
    { id: 'experience', done: s.experience.length > 0, key: 'step.experience', href: '/profile#experience' },
    { id: 'education', done: s.education.length > 0, key: 'step.education', href: '/profile#education' },
    { id: 'skills', done: s.skills.length >= 3, key: 'step.skills', href: '/profile#skills' },
    { id: 'portfolio', done: s.portfolio.length > 0, key: 'step.portfolio', href: '/profile#portfolio' },
    { id: 'verifyAny', done: entries.some((e) => e.status === 'verified'), key: 'step.verifyAny', href: '/profile#experience' },
    { id: 'verify', done: !entries.some((e) => e.status === 'self'), key: 'step.verify', href: '/profile#experience' },
  ];
}

export function getCounts(s) {
  const entries = [...s.experience, ...s.achievements];
  return {
    verified: entries.filter((e) => e.status === 'verified').length,
    pending: entries.filter((e) => e.status === 'pending').length,
    self: entries.filter((e) => e.status === 'self').length,
  };
}

const AppContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const value = useMemo(() => {
    const checklist = getChecklist(state);
    const done = checklist.filter((c) => c.done).length;
    return {
      state,
      dispatch,
      checklist,
      completion: { done, total: checklist.length, pct: Math.round((done / checklist.length) * 100) },
      counts: getCounts(state),
    };
  }, [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
