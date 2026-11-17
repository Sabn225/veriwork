// Project taxonomy: categories (names live in the dictionary as `cat.<key>`) and their subcategories.
// A subcategory is a named set of skills: a project belongs to it when it lists at least one of those skills.
// That keeps the menu, the browse page and the project data in sync without a second tagging system.
// When real listings exist, keep this file as the menu structure and let the API decide which projects match.

export const loc = (v, lang) => (typeof v === 'string' ? v : (v && (v[lang] || v.en)) || '');

// Lower-case and strip accents so that typing "thiet ke" still finds "thiết kế".
export const fold = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

export const CATEGORIES = [
  {
    key: 'writing',
    subs: [
      { key: 'copywriting', skills: ['Copywriting'], name: { en: 'Copywriting', vi: 'Viết quảng cáo' }, desc: { en: 'Product pages, ads and brand voice', vi: 'Mô tả sản phẩm, quảng cáo và giọng văn thương hiệu' } },
      { key: 'seo-content', skills: ['SEO'], name: { en: 'SEO content', vi: 'Nội dung SEO' }, desc: { en: 'Articles written to be found in search', vi: 'Bài viết viết để dễ được tìm thấy' } },
      { key: 'translation', skills: ['Translation'], name: { en: 'Translation', vi: 'Dịch thuật' }, desc: { en: 'English–Vietnamese and other pairs', vi: 'Anh–Việt và các cặp ngôn ngữ khác' } },
      { key: 'editing', skills: ['Proofreading', 'Editing'], name: { en: 'Proofreading and editing', vi: 'Biên tập và hiệu đính' }, desc: { en: 'Polish drafts and fix errors', vi: 'Chỉnh sửa bản thảo và sửa lỗi' } },
    ],
  },
  {
    key: 'design',
    subs: [
      { key: 'social-graphics', skills: ['Figma', 'Canva'], name: { en: 'Social media graphics', vi: 'Thiết kế mạng xã hội' }, desc: { en: 'Post, story and cover templates', vi: 'Mẫu bài đăng, story và ảnh bìa' } },
      { key: 'branding', skills: ['Branding', 'Logo design'], name: { en: 'Branding', vi: 'Nhận diện thương hiệu' }, desc: { en: 'Logos, colours and style guides', vi: 'Logo, màu sắc và hướng dẫn thương hiệu' } },
      { key: 'ui-design', skills: ['Figma', 'UI design'], name: { en: 'UI and web design', vi: 'Thiết kế giao diện' }, desc: { en: 'Screens and layouts for sites and apps', vi: 'Giao diện cho website và ứng dụng' } },
    ],
  },
  {
    key: 'development',
    subs: [
      { key: 'websites', skills: ['React', 'CSS', 'HTML'], name: { en: 'Websites and landing pages', vi: 'Website và landing page' }, desc: { en: 'Responsive pages built from a design', vi: 'Trang responsive dựng từ bản thiết kế' } },
      { key: 'web-apps', skills: ['React', 'JavaScript', 'Next.js'], name: { en: 'Web apps', vi: 'Ứng dụng web' }, desc: { en: 'Interactive tools and small apps', vi: 'Công cụ tương tác và ứng dụng nhỏ' } },
    ],
  },
  {
    key: 'marketing',
    subs: [
      { key: 'short-video', skills: ['Video scripting', 'Video editing'], name: { en: 'Short-form video', vi: 'Video ngắn' }, desc: { en: 'Scripts and shot lists for short clips', vi: 'Kịch bản và danh sách cảnh quay cho clip ngắn' } },
      { key: 'social-media', skills: ['Social media'], name: { en: 'Social media', vi: 'Mạng xã hội' }, desc: { en: 'Content plans and posts', vi: 'Kế hoạch nội dung và bài đăng' } },
    ],
  },
  {
    key: 'data',
    subs: [
      { key: 'spreadsheets', skills: ['Excel'], name: { en: 'Spreadsheets', vi: 'Bảng tính' }, desc: { en: 'Clean up and structure Excel files', vi: 'Làm sạch và cấu trúc file Excel' } },
      { key: 'data-analysis', skills: ['Data analysis'], name: { en: 'Data analysis and reports', vi: 'Phân tích dữ liệu và báo cáo' }, desc: { en: 'Find the patterns and write them up', vi: 'Tìm xu hướng và trình bày thành báo cáo' } },
    ],
  },
];

export const PROJECT_TYPES = ['fixed', 'hour']; // matches `budget.unit` in sampleProjects

export const findCategory = (key) => CATEGORIES.find((c) => c.key === key) || null;
export const findSub = (categoryKey, subKey) => findCategory(categoryKey)?.subs.find((s) => s.key === subKey) || null;

// One place that builds every link into the browse page, so the menu, the filters and the landing page agree.
export function browseHref({ category = '', sub = '', type = '', skill = '', q = '' } = {}) {
  const p = new URLSearchParams();
  if (category) p.set('category', category);
  if (category && sub) p.set('sub', sub);
  if (type) p.set('type', type);
  if (skill) p.set('skill', skill);
  if (q.trim()) p.set('q', q.trim());
  const qs = p.toString();
  return qs ? `/browse?${qs}` : '/browse';
}

export function filterProjects(list, { category = '', sub = '', type = '', skill = '', q = '' }, lang) {
  const needle = fold(q.trim());
  const subSkills = category && sub ? (findSub(category, sub)?.skills || []).map(fold) : null;
  const wanted = fold(skill);
  return list.filter((p) => {
    if (category && p.category !== category) return false;
    if (subSkills && !p.skills.some((s) => subSkills.includes(fold(s)))) return false;
    if (type && p.budget.unit !== type) return false;
    if (wanted && !p.skills.some((s) => fold(s) === wanted)) return false;
    if (needle) {
      const haystack = fold([loc(p.title, lang), loc(p.summary, lang), ...p.skills].join(' '));
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}
