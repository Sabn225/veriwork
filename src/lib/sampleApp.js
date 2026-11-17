// ILLUSTRATIVE DATA ONLY. Everything the app workspace shows comes from this module and lives in memory
// (see components/app/AppState.jsx). Replace these with API calls when the backend is connected,
// then set APP_PREVIEW = false in lib/siteConfig.js.

// Text that can be bilingual is stored as { en, vi }; text a user types is stored as a plain string.
export const loc = (v, lang) => (typeof v === 'string' ? v : (v && (v[lang] || v.en)) || '');

export const SAMPLE_REFERENCE = 'VW-0000-0000';

export const INITIAL_STATE = {
  photoUrl: '',
  user: {
    name: 'Nguyen Van A',
    email: 'a.nguyen@example.com',
    location: 'Ho Chi Minh City, Vietnam',
    headline: { en: 'Content Writer', vi: 'Biên tập nội dung' },
    about: {
      en: 'Writer and editor focused on clear, well-researched copy for small businesses and student organisations. I enjoy turning a rough brief into something people actually finish reading.',
      vi: 'Biên tập viên và người viết nội dung, tập trung vào những bài viết rõ ràng, có nghiên cứu cho doanh nghiệp nhỏ và các tổ chức sinh viên. Tôi thích biến một bản brief còn thô thành nội dung mà người đọc muốn đọc đến cuối.',
    },
  },
  experience: [
    {
      id: 'x1',
      status: 'verified',
      title: { en: 'Website copy for a student-run shop', vi: 'Nội dung website cho cửa hàng của sinh viên' },
      org: { en: 'Student-run shop', vi: 'Cửa hàng của sinh viên' },
      period: '2025',
      description: { en: 'Wrote and edited all pages of the shop’s first website, including product descriptions and the About page.', vi: 'Viết và biên tập toàn bộ các trang của website đầu tiên của cửa hàng, gồm mô tả sản phẩm và trang Giới thiệu.' },
    },
    {
      id: 'x2',
      status: 'verified',
      title: { en: '12-article SEO blog series', vi: 'Loạt 12 bài blog chuẩn SEO' },
      org: { en: 'Independent project', vi: 'Dự án độc lập' },
      period: '2025',
      description: { en: 'Planned keywords and wrote a twelve-part series on sustainable fashion, one article a week.', vi: 'Lên kế hoạch từ khóa và viết loạt mười hai bài về thời trang bền vững, mỗi tuần một bài.' },
    },
    {
      id: 'x3',
      status: 'self',
      title: { en: 'Freelance proofreading', vi: 'Hiệu đính tự do' },
      org: { en: 'Self-employed', vi: 'Tự do' },
      period: '2024 – 2026',
      description: { en: 'Proofread essays and short reports for fellow students.', vi: 'Hiệu đính bài luận và báo cáo ngắn cho các bạn sinh viên.' },
    },
  ],
  education: [
    {
      id: 'e1',
      school: { en: 'Example University', vi: 'Trường Đại học Ví dụ' },
      degree: { en: 'BA, Communications', vi: 'Cử nhân Truyền thông' },
      period: '2023 – 2027',
    },
  ],
  skills: [
    { id: 'k1', name: 'Copywriting' },
    { id: 'k2', name: 'SEO' },
    { id: 'k3', name: 'Editing' },
  ],
  portfolio: [
    {
      id: 'pf1',
      title: { en: 'Sustainable fashion blog series', vi: 'Loạt blog thời trang bền vững' },
      description: { en: 'Twelve articles with keyword briefs and results notes.', vi: 'Mười hai bài viết kèm brief từ khóa và ghi chú kết quả.' },
      link: '',
    },
  ],
  achievements: [
    {
      id: 'a1',
      status: 'self',
      title: { en: 'Top 10, university writing contest', vi: 'Top 10 cuộc thi viết của trường đại học' },
      year: '2025',
    },
  ],
  services: [
    {
      id: 's1',
      status: 'active',
      title: { en: 'SEO blog articles', vi: 'Bài blog chuẩn SEO' },
      description: { en: 'Researched articles of about 900 words, written around a keyword brief. Sources listed and one round of edits included.', vi: 'Bài viết có nghiên cứu khoảng 900 từ, viết theo brief từ khóa. Có liệt kê nguồn và gồm một lần chỉnh sửa.' },
      skills: ['Copywriting', 'SEO'],
      price: 40,
      deliveryDays: 5,
      availability: 'open',
      portfolio: ['pf1'],
    },
    {
      id: 's2',
      status: 'paused',
      title: { en: 'Proofreading and light editing', vi: 'Hiệu đính và biên tập nhẹ' },
      description: { en: 'Grammar, spelling and clarity pass for essays, reports and web copy up to 3,000 words.', vi: 'Rà soát ngữ pháp, chính tả và độ rõ ràng cho bài luận, báo cáo và nội dung web đến 3.000 từ.' },
      skills: ['Editing'],
      price: 15,
      deliveryDays: 2,
      availability: 'limited',
      portfolio: [],
    },
  ],
  saved: ['p3'],
  applications: [
    { id: 'ap1', projectId: 'p4', status: 'review', when: '2026-11-08' },
    { id: 'ap2', projectId: 'p6', status: 'submitted', when: '2026-11-12' },
  ],
  prefs: {
    privacy: { publicProfile: true, showSelfDeclared: true, showEmail: false },
    notifications: { matches: true, applications: true, verification: true, news: false },
  },
};

export const ACTIVE_PROJECTS = [
  {
    id: 'ac1',
    title: { en: 'Product descriptions for a bakery', vi: 'Mô tả sản phẩm cho một tiệm bánh' },
    client: { en: 'Neighbourhood bakery', vi: 'Tiệm bánh trong khu phố' },
    due: '2026-11-28',
    next: { en: 'Send the second draft', vi: 'Gửi bản nháp thứ hai' },
  },
];

export const ACTIVITY = [
  { id: 'ev1', when: { en: '2 days ago', vi: '2 ngày trước' }, text: { en: 'Your entry “12-article SEO blog series” was verified.', vi: 'Mục “Loạt 12 bài blog chuẩn SEO” của bạn đã được xác minh.' } },
  { id: 'ev2', when: { en: '3 days ago', vi: '3 ngày trước' }, text: { en: 'You applied to “English–Vietnamese translation of onboarding guides”.', vi: 'Bạn đã ứng tuyển “Dịch hướng dẫn nhập môn Anh–Việt”.' } },
  { id: 'ev3', when: { en: '1 week ago', vi: '1 tuần trước' }, text: { en: 'Your application for “Short-form video scripts for a coffee shop” is in review.', vi: 'Đơn ứng tuyển “Kịch bản video ngắn cho một quán cà phê” của bạn đang được xem xét.' } },
  { id: 'ev4', when: { en: '2 weeks ago', vi: '2 tuần trước' }, text: { en: 'Your entry “Website copy for a student-run shop” was verified.', vi: 'Mục “Nội dung website cho cửa hàng của sinh viên” của bạn đã được xác minh.' } },
];

// Illustrative scoring model. The real scoring system is not implemented, so the Trust Score page labels all of this as an example.
export const TRUST_FACTORS = [
  {
    id: 'profile',
    max: 25,
    earned: 18,
    name: { en: 'Profile completeness', vi: 'Mức hoàn thiện hồ sơ' },
    text: { en: 'A filled-in profile with a photo, About, education and skills.', vi: 'Hồ sơ đầy đủ với ảnh, phần Giới thiệu, học vấn và kỹ năng.' },
    action: { en: 'Add a profile photo and a portfolio item.', vi: 'Thêm ảnh đại diện và một mục portfolio.' },
    href: '/profile',
  },
  {
    id: 'entries',
    max: 35,
    earned: 20,
    name: { en: 'Verified entries', vi: 'Mục đã xác minh' },
    text: { en: 'Experience entries that have been reviewed and confirmed count for more than self-declared ones.', vi: 'Các mục kinh nghiệm đã được xem xét và xác nhận có giá trị hơn các mục tự khai.' },
    action: { en: 'Request verification for your self-declared entry.', vi: 'Yêu cầu xác minh mục tự khai của bạn.' },
    href: '/profile#experience',
  },
  {
    id: 'email',
    max: 10,
    earned: 10,
    name: { en: 'Email verification', vi: 'Xác minh email' },
    text: { en: 'Confirms that you control the email address on your account.', vi: 'Xác nhận bạn kiểm soát địa chỉ email của tài khoản.' },
    action: { en: 'Nothing to do.', vi: 'Không cần làm gì thêm.' },
    href: '/settings#account',
  },
  {
    id: 'identity',
    max: 20,
    earned: 0,
    name: { en: 'Identity verification', vi: 'Xác minh danh tính' },
    text: { en: 'Confirms that the person behind the profile is who they say they are.', vi: 'Xác nhận người đứng sau hồ sơ đúng là người mà họ khai báo.' },
    action: { en: 'Identity verification is not available yet.', vi: 'Xác minh danh tính hiện chưa khả dụng.' },
    href: null,
  },
  {
    id: 'reference',
    max: 10,
    earned: 10,
    name: { en: 'Credential reference', vi: 'Mã tham chiếu chứng chỉ' },
    text: { en: 'A reference ID and QR code that open your full profile.', vi: 'Mã tham chiếu và mã QR mở toàn bộ hồ sơ của bạn.' },
    action: { en: 'Nothing to do.', vi: 'Không cần làm gì thêm.' },
    href: '/profile#credentials',
  },
];
