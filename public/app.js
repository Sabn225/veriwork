/* Header theo trạng thái đăng nhập + mở hộp thoại đăng nhập/đăng ký */
(function () {
  let user = null;
  try { user = localStorage.getItem('vw_token') && JSON.parse(localStorage.getItem('vw_user') || 'null'); } catch (e) {}
  document.documentElement.dataset.auth = user ? 'in' : 'out';
  const name = user && user.fullName ? user.fullName : 'Khách (demo)';
  const badge = document.getElementById('headerAvatarBadge'), label = document.getElementById('headerUserName');
  if (label) label.textContent = name;
  if (badge) badge.textContent = name.split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('').toUpperCase() || 'K';
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-auth-open]');
    if (open && window.openAuthModal) window.openAuthModal(open.dataset.authOpen);
    if (e.target.closest('[data-logout]') && window.logoutRealAccount) window.logoutRealAccount();
  });
})();
/* ============================================================================
   K3: ĐẶT TÊN BIẾN RÕ NGHĨA, DỄ BẢO TRÌ & MỞ RỘNG
   ============================================================================ */
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const normalizeText = str => String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
const formatCurrency = val => Number(val || 0).toLocaleString('vi-VN') + 'đ';
const escapeHtml = str => String(str || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const formatToday = () => new Date().toLocaleDateString('vi-VN');
const formatNow = () => new Date().toLocaleString('vi-VN');

/* G1: Toast thông minh tránh bàn phím ảo trên di động */
function showToast(message) {
  const toastEl = $('#toast');
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    const toastEl = $('#toast');
    if (!toastEl) return;
    const offsetBottom = window.innerHeight - window.visualViewport.height;
    toastEl.style.bottom = offsetBottom > 80 ? `${offsetBottom + 16}px` : '';
  });
}

/* H: Quản lý Dark / Light Mode */
function updateThemeButtonIcon() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const btn = $('#themeBtn');
  if (btn) btn.textContent = current === 'dark' ? '🌙' : '☀️';
}
updateThemeButtonIcon();
$('#themeBtn').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('veriwork_theme', next); } catch (e) {}
  updateThemeButtonIcon();
  showToast(next === 'dark' ? '🌙 Đã bật giao diện Tối' : '☀️ Đã bật giao diện Sáng');
});

/* ============================================================================
   DỮ LIỆU TRUNG TÂM (DATA LAYER)
   ============================================================================ */
const APP_STATE = {
  currentView: 'home',
  currentRole: 'student', // 'student' | 'employer' | 'admin'
  walletBalance: 1350000,
  savedProjectIds: ['proj-1'], // Sửa lỗi: lưu bằng ID thay vì index
  comparedStudentIds: [],
  recentSearches: JSON.parse(localStorage.getItem('veriwork_recent_searches') || '["mô tả thời trang", "quán cafe", "handmade"]'),
  filterCategory: 'all',
  filterMinBudget: 0,
  filterDuration: 'all',
  filterOnlyOpen: false,
  sortBy: 'newest',
  howRole: 'sv',
  pendingSubmission: {
    id: 'VW-2026-889',
    projectTitle: 'Viết mô tả cho 20 sản phẩm thời trang nữ công sở',
    studentName: 'Nguyễn Phương Thảo',
    clientName: 'Chuỗi Thời trang Thiết kế M.L (Đã xác minh MST)',
    budget: 600000,
    status: 'working', // 'working' | 'submitted_to_admin' | 'approved'
    docLink: 'https://docs.google.com/document/d/1VeriWork-20-Mo-Ta-Thoi-Trang-Nu/edit',
    fileName: ''
  }
};

const NOTIFICATIONS = [
  { id: 'n1', text: '🎉 Khách hàng Shop Thời trang L.A đã xác nhận hoàn thành dự án và cấp thẻ EXP-2026-000124.', time: '15 phút trước', unread: true, targetView: 'verify' },
  { id: 'n2', text: '💬 Chuỗi Thời trang M.L vừa gửi tin nhắn mới trong Phòng làm việc #VW-2026-889.', time: '1 giờ trước', unread: true, targetView: 'workspace' },
  { id: 'n3', text: '🔥 Dự án nổi bật mới: Viết mô tả 30 sản phẩm phụ kiện gốm sứ (750.000đ).', time: '2 giờ trước', unread: false, targetView: 'home' },
  { id: 'n4', text: '🛡️ Hồ sơ của bạn vừa được 3 nhà tuyển dụng xem và lưu vào danh sách quan tâm.', time: 'Hôm qua', unread: false, targetView: 'profile' }
];

const FEATURED_STUDENTS = [
  {
    id: 'stu-1',
    code: 'MA',
    name: 'Nguyễn Phương Thảo',
    uni: 'ĐH Thăng Long',
    headline: 'Chuyên viết mô tả sản phẩm Thời trang & Mỹ phẩm chuẩn SEO',
    trustScore: 92,
    cardsCount: 3,
    onTimeRate: '100%',
    firstPassRate: '95%',
    rehireRate: '67%',
    minPrice: 150000,
    skills: ['Mô tả thời trang', 'SEO Copywriting', 'Bảng từ khóa'],
    badges: ['🟢 .edu.vn', '🟣 CCCD']
  },
  {
    id: 'stu-2',
    code: 'TH',
    name: 'Lê Thu Hà',
    uni: 'ĐH Ngoại thương',
    headline: 'Storytelling cho sản phẩm Thủ công, Quà tặng & Đồ trang trí',
    trustScore: 96,
    cardsCount: 11,
    onTimeRate: '100%',
    firstPassRate: '98%',
    rehireRate: '82%',
    minPrice: 180000,
    skills: ['Storytelling', 'Nội dung Handmade', 'Kịch bản ảnh'],
    badges: ['🟢 .edu.vn', '🟣 CCCD', '★ Top 1%']
  },
  {
    id: 'stu-3',
    code: 'QB',
    name: 'Trần Quốc Bảo',
    uni: 'ĐH Bách khoa Hà Nội',
    headline: 'Chuyên viết chuỗi bài đăng Fanpage & Lịch nội dung cho Quán Cafe',
    trustScore: 89,
    cardsCount: 4,
    onTimeRate: '95%',
    firstPassRate: '90%',
    rehireRate: '50%',
    minPrice: 140000,
    skills: ['Caption F&B', 'Lịch nội dung', 'Minigame'],
    badges: ['🟢 .edu.vn', '🟣 CCCD']
  }
];

const CATEGORIES = {
  all: 'Tất cả',
  viet: 'Viết nội dung',
  video: 'Dựng Video ngắn',
  kd: 'Thiết kế Poster',
  data: 'Chuẩn hóa dữ liệu'
};

const PROJECTS = [
  {
    id: 'proj-1',
    title: 'Viết mô tả 30 sản phẩm phụ kiện gốm sứ thủ công xuất khẩu',
    category: 'viet',
    budget: 750000,
    days: 7,
    durationText: '7 ngày',
    isOpen: true,
    featured: true,
    postedAgo: 'Đăng 45 phút trước',
    createdOrder: 1,
    applicants: 4,
    clientIcon: '🏺',
    clientName: 'Xưởng Gốm Thủ Công B.T (Đã xác minh MST)',
    brief: 'Viết 30 bài mô tả theo lối kể chuyện (storytelling) cho bộ sưu tập cốc trà, bình hoa gốm sứ thủ công. Nêu bật chất men tự nhiên, kích thước và độ an toàn khi dùng lò vi sóng.',
    checklist: [
      'Độ dài từ 120 – 150 từ cho mỗi sản phẩm',
      'Nêu đầy đủ kích thước, dung tích và chất liệu men gốm',
      'Chèn tự nhiên 01 từ khóa chính vào 50 chữ đầu tiên',
      'Nội dung độc bản 100%, không dùng văn mẫu sáo rỗng'
    ]
  },
  {
    id: 'proj-2',
    title: 'Viết mô tả cho 20 sản phẩm thời trang nữ công sở Thu Đông',
    category: 'viet',
    budget: 600000,
    days: 5,
    durationText: '5 ngày',
    isOpen: true,
    featured: false,
    postedAgo: 'Đăng 2 giờ trước',
    createdOrder: 2,
    applicants: 3,
    clientIcon: '👗',
    clientName: 'Chuỗi Thời trang Thiết kế M.L (Đã xác minh MST)',
    brief: 'Viết 20 bài mô tả đầm liền và áo sơ mi công sở gắn lên website. Giọng văn thanh lịch, tư vấn cách phối đồ, thông số 3 size S/M/L và hướng dẫn giặt ủi.',
    checklist: [
      'Độ dài mỗi bài từ 100 – 140 từ',
      'Chèn tự nhiên 1 từ khóa chính do shop cung cấp',
      'Nêu rõ thông số 3 size S/M/L và chất liệu vải',
      'Nội dung độc bản 100%, không sao chép từ sàn khác'
    ]
  },
  {
    id: 'proj-3',
    title: 'Viết 15 bài đăng Fanpage cho quán Cafe Specialty mới mở',
    category: 'viet',
    budget: 450000,
    days: 4,
    durationText: '4 ngày',
    isOpen: true,
    featured: false,
    postedAgo: 'Đăng 4 giờ trước',
    createdOrder: 3,
    applicants: 5,
    clientIcon: '☕',
    clientName: 'Tiệm Cafe H.A (Đã xác minh SĐT & GPKD)',
    brief: 'Xây dựng 15 bài đăng giới thiệu hạt cà phê rang mộc, không gian làm việc yên tĩnh và combo bánh ngọt buổi sáng cho nhân viên văn phòng.',
    checklist: [
      'Mỗi bài từ 80 – 120 từ kèm lời kêu gọi hành động (CTA)',
      'Đính kèm bộ 5 hashtag định vị khu vực',
      'Đúng tông giọng ấm áp, gần gũi của quán'
    ]
  },
  {
    id: 'proj-4',
    title: 'Viết 10 bài mô tả combo quà Tết doanh nghiệp cao cấp',
    category: 'viet',
    budget: 550000,
    days: 3,
    durationText: '3 ngày',
    isOpen: true,
    featured: false,
    postedAgo: 'Đăng 6 giờ trước',
    createdOrder: 4,
    applicants: 2,
    clientIcon: '🎁',
    clientName: 'Công ty Quà tặng S.V (Đã xác minh MST)',
    brief: 'Viết mô tả chi tiết cho 10 hộp quà doanh nghiệp gồm trà thượng hạng, hạt dinh dưỡng và sổ tay da. Nhấn mạnh ý nghĩa tri ân đối tác.',
    checklist: [
      'Mỗi bài 130 – 160 từ, giọng văn trang trọng',
      'Liệt kê rõ thành phần định lượng từng món trong hộp quà',
      'Bàn giao kèm file tổng hợp tiêu đề phụ'
    ]
  },
  {
    id: 'proj-5',
    title: 'Dựng 5 video ngắn (Reels/TikTok 30s) pha chế đồ uống mùa đông',
    category: 'video',
    budget: 650000,
    days: 6,
    durationText: '6 ngày',
    isOpen: false,
    featured: false,
    postedAgo: 'Mở ở giai đoạn 2',
    createdOrder: 5,
    applicants: 7,
    clientIcon: '🎬',
    clientName: 'Chuỗi Trà Sữa O.T (Đã xác minh MST)',
    brief: 'Ngách dịch vụ dựng video ngắn đang được hoàn thiện bộ Checklist nghiệm thu kỹ thuật (tỷ lệ khung hình, phụ đề, âm thanh bản quyền).',
    checklist: ['Độ phân giải 1080x1920 (9:16)', 'Có phụ đề tiếng Việt chuẩn chính tả']
  },
  {
    id: 'proj-6',
    title: 'Chuẩn hóa thông tin & gắn thẻ 200 mã sản phẩm thời trang',
    category: 'data',
    budget: 350000,
    days: 3,
    durationText: '3 ngày',
    isOpen: false,
    featured: false,
    postedAgo: 'Mở ở giai đoạn 2',
    createdOrder: 6,
    applicants: 6,
    clientIcon: '📊',
    clientName: 'Kho Phụ Kiện K.N (Đã xác minh SĐT)',
    brief: 'Ngách nhập liệu và chuẩn hóa bảng tính sẽ mở sau khi ngách viết nội dung đạt mốc 200 giao dịch.',
    checklist: ['Đúng định dạng file mẫu 100%', 'Không trùng lặp mã SKU']
  }
];

const CERTIFICATES_DB = {
  'EXP-2026-000124': {
    code: 'EXP-2026-000124',
    studentName: 'Nguyễn Phương Thảo',
    uni: 'ĐH Thăng Long (Đã xác thực .edu.vn)',
    role: 'Content Writer',
    projectTitle: 'Viết mô tả cho 20 sản phẩm thời trang nữ Thu Đông',
    clientName: 'Shop Thời trang L.A (Đã xác thực MST — Yêu cầu ẩn danh tên thương hiệu)',
    issuedDate: formatToday(),
    rating: '5.0 / 5.0 ★★★★★',
    review: 'Bài viết đúng chuẩn SEO, lồng ghép khéo léo chất liệu vải và bảng size. Giao bài sớm 1 ngày.',
    checklistResult: '20/20 bài đạt 100% tiêu chí ở vòng duyệt đầu tiên',
    licenseStatus: 'Published (Sinh viên đã bật xuất bản vào Portfolio)',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
  },
  'EXP-2026-000189': {
    code: 'EXP-2026-000189',
    studentName: 'Trần Quốc Bảo',
    uni: 'ĐH Bách khoa Hà Nội (Đã xác thực .edu.vn)',
    role: 'Social Media Copywriter',
    projectTitle: 'Chuỗi 15 bài đăng truyền thông cho quán Cafe Acoustic',
    clientName: 'Tiệm Cafe M. (Đã xác thực SĐT & GPKD)',
    issuedDate: formatToday(),
    rating: '4.9 / 5.0 ★★★★★',
    review: 'Giọng văn trẻ trung, bắt đúng tâm lý khách hàng trẻ, kèm sẵn gợi ý góc chụp ảnh rất dễ triển khai.',
    checklistResult: '15/15 bài đạt chuẩn + 1 bảng kế hoạch hashtag',
    licenseStatus: 'Published (Sinh viên đã bật xuất bản vào Portfolio)',
    hash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1'
  },
  'EXP-2026-000205': {
    code: 'EXP-2026-000205',
    studentName: 'Lê Thu Hà',
    uni: 'ĐH Ngoại thương (Đã xác thực .edu.vn)',
    role: 'Brand Storyteller',
    projectTitle: 'Bộ 16 bài mô tả nến thơm & phụ kiện handmade cao cấp',
    clientName: 'Xưởng Thủ công H.G (Đã xác thực MST)',
    issuedDate: formatToday(),
    rating: '5.0 / 5.0 ★★★★★',
    review: 'Cách kể chuyện mùi hương rất cuốn hút, tỷ lệ khách nhắn tin hỏi mua tăng rõ rệt sau khi cập nhật mô tả.',
    checklistResult: '16/16 bài đạt chuẩn độc bản 100%',
    licenseStatus: 'Published (Sinh viên đã bật xuất bản vào Portfolio)',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  }
};

const PORTFOLIO_ITEMS = [
  {
    code: 'EXP-2026-000124',
    title: 'Mô tả 20 sản phẩm thời trang nữ Thu Đông',
    client: 'Shop Thời trang L.A (Ẩn danh theo yêu cầu)',
    date: formatToday(),
    rating: '5.0 ★',
    published: true,
    excerpt: '“Đầm suông cổ V thanh lịch sử dụng chất liệu tuyết mưa dày dặn, giữ phom chuẩn suốt 8 giờ làm việc...”'
  },
  {
    code: 'EXP-2026-000098',
    title: 'Viết 12 bài giới thiệu BST Áo dài Tết truyền thống',
    client: 'Nhà may Áo dài H.N (Đã xác minh MST)',
    date: '28/10/2026',
    rating: '4.9 ★',
    published: true,
    excerpt: '“Lấy cảm hứng từ sắc đào Nhật Tân, tà áo dài lụa tơ tằm mang lại vẻ dịu dàng mà vẫn tôn dáng...”'
  },
  {
    code: 'EXP-2026-000072',
    title: 'Viết 15 bài mô tả phụ kiện túi xách da công sở',
    client: 'Thương hiệu Đồ da K.L (Chế độ ẩn chi tiết sản phẩm)',
    date: '14/10/2026',
    rating: '5.0 ★',
    published: false,
    excerpt: 'Chỉ hiển thị Thẻ kinh nghiệm xác nhận vai trò, công cụ và kết quả nghiệm thu theo yêu cầu bảo mật.'
  }
];

const ACTIVITY_LOGS = [
  { time: `${formatToday()} • 09:30`, text: 'Hoàn thành dự án “Mô tả 20 sản phẩm thời trang nữ”, đạt 20/20 tiêu chí Checklist.' },
  { time: `${formatToday()} • 10:15`, text: 'Khách hàng xác nhận nghiệm thu → Hệ thống phát hành thẻ EXP-2026-000124.' },
  { time: `${formatToday()} • 10:20`, text: 'Sinh viên chủ động bật “Xuất bản vào Portfolio” cho thẻ EXP-2026-000124.' }
];

const WALLET_HISTORY = [
  { date: formatToday(), title: 'Giải ngân đơn #VW-2026-812 (20 mô tả thời trang)', amount: '+550.000đ', status: 'Hoàn tất' },
  { date: '28/10/2026', title: 'Giải ngân đơn #VW-2026-790 (12 bài Áo dài Tết)', amount: '+480.000đ', status: 'Hoàn tất' },
  { date: '15/10/2026', title: 'Giải ngân đơn #VW-2026-741 (15 mô tả túi xách)', amount: '+320.000đ', status: 'Hoàn tất' }
];

/* ============================================================================
   QR GENERATOR (SVG THUẦN)
   ============================================================================ */
function generateQrSvg(code) {
  let seed = 0;
  for (const ch of String(code)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const nextRand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#161A42"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#161A42"/>`;
  let dots = '';
  for (let y = 0; y < 25; y++) {
    for (let x = 0; x < 25; x++) {
      if ((x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)) continue;
      if (nextRand() > 0.5) dots += `<rect x="${x}" y="${y}" width="1" height="1" fill="#161A42"/>`;
    }
  }
  return `<svg viewBox="0 0 25 25" shape-rendering="crispEdges" role="img" aria-label="Mã QR ${escapeHtml(code)}">${finder(0,0)}${finder(18,0)}${finder(0,18)}${dots}</svg>`;
}
$('#heroQrBox').innerHTML = generateQrSvg('EXP-2026-000124');
$('#heroQrBox').addEventListener('click', () => {
  switchView('verify');
  renderVerifyCertificate('EXP-2026-000124');
});

/* ============================================================================
   A. ĐIỀU HƯỚNG VIEW & DROPDOWN HEADER (CHUÔNG + AVATAR MENU)
   ============================================================================ */
function switchView(viewName, scrollTargetId = null) {
  APP_STATE.currentView = viewName;
  $$('.view-panel').forEach(panel => panel.classList.toggle('active', panel.id === `view-${viewName}`));

  // Cập nhật trạng thái active trên thanh nav desktop & mobile
  $$('.nav-tabs button').forEach(btn => {
    const isMatch = btn.dataset.nav === viewName && (!btn.dataset.scrollTo || !scrollTargetId);
    btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
  });
  $$('.mobile-bottom-nav button').forEach(btn => {
    btn.setAttribute('aria-selected', btn.dataset.nav === viewName ? 'true' : 'false');
  });

  closeAllDropdowns();
  if (scrollTargetId) {
    setTimeout(() => {
      const el = document.getElementById(scrollTargetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function closeAllDropdowns() {
  $('#notifMenu').classList.remove('open');
  $('#avatarDropdown').classList.remove('open');
  $('#searchDropdown').classList.remove('open');
}

$('#notifBtn').addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = $('#notifMenu').classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) $('#notifMenu').classList.add('open');
});

$('#avatarMenuBtn').addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = $('#avatarDropdown').classList.contains('open');
  closeAllDropdowns();
  if (!isOpen) $('#avatarDropdown').classList.add('open');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown-wrap') && !e.target.closest('#heroSearchWrap')) {
    closeAllDropdowns();
  }
  const navBtn = e.target.closest('[data-nav]');
  if (navBtn) {
    const targetView = navBtn.dataset.nav;
    const scrollTo = navBtn.dataset.scrollTo || null;
    switchView(targetView, scrollTo);
    if (navBtn.dataset.jumpLegal) {
      LEGAL_STATE.activeTab = navBtn.dataset.jumpLegal;
      renderLegalTabs();
      renderLegalPanel();
    }
    return;
  }
  const scrollBtn = e.target.closest('[data-scroll-to]:not([data-nav])');
  if (scrollBtn) {
    const el = document.getElementById(scrollBtn.dataset.scrollTo);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
});

/* J1: Render Notification Center */
function renderNotifications() {
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
  $('#notifBadge').style.display = unreadCount > 0 ? 'block' : 'none';
  $('#notifList').innerHTML = NOTIFICATIONS.map(item => `
    <button class="dd-item" data-notif-id="${item.id}" style="align-items:flex-start;flex-direction:column;gap:4px;background:${item.unread ? 'var(--ob)' : 'transparent'};margin-bottom:4px">
      <div style="font-size:13px;font-weight:${item.unread ? '700' : '500'};line-height:1.4">${escapeHtml(item.text)}</div>
      <span class="muted2" style="font-size:11.5px">${escapeHtml(item.time)}</span>
    </button>
  `).join('');
}
renderNotifications();

$('#markAllReadBtn').addEventListener('click', e => {
  e.stopPropagation();
  NOTIFICATIONS.forEach(n => n.unread = false);
  renderNotifications();
  showToast('✓ Đã đánh dấu đọc tất cả thông báo');
});

$('#notifList').addEventListener('click', e => {
  const itemBtn = e.target.closest('[data-notif-id]');
  if (!itemBtn) return;
  const notif = NOTIFICATIONS.find(n => n.id === itemBtn.dataset.notifId);
  if (notif) {
    notif.unread = false;
    renderNotifications();
    switchView(notif.targetView);
  }
});

/* Chuyển đổi Role Demo trong Avatar Dropdown */
$$('[data-switch-role]').forEach(btn => {
  btn.addEventListener('click', () => {
    const role = btn.dataset.switchRole;
    APP_STATE.currentRole = role;
    $('#roleCheckStudent').textContent = role === 'student' ? '✓' : '';
    $('#roleCheckEmployer').textContent = role === 'employer' ? '✓' : '';
    $('#roleCheckAdmin').textContent = role === 'admin' ? '✓' : '';
    $('#adminNavTab').style.display = role === 'admin' ? 'inline-block' : 'none';

    if (role === 'student') {
      $('#headerUserName').textContent = 'Phương Thảo';
      $('#ddFullName').textContent = 'Nguyễn Phương Thảo';
      $('#ddRoleLabel').textContent = 'Sinh viên • ĐH Thăng Long';
      showToast('🎓 Đang xem với góc nhìn Sinh viên');
    } else if (role === 'employer') {
      $('#headerUserName').textContent = 'Shop M.L';
      $('#ddFullName').textContent = 'Chuỗi Thời trang M.L';
      $('#ddRoleLabel').textContent = 'Khách hàng • Đã xác minh MST';
      showToast('🏪 Đang xem với góc nhìn Khách hàng');
    } else {
      $('#headerUserName').textContent = 'Admin';
      $('#ddFullName').textContent = 'Quản trị viên VeriWork';
      $('#ddRoleLabel').textContent = 'Kiểm duyệt Lớp 2 & Tranh chấp';
      switchView('admin');
      showToast('🛡️ Đã bật quyền Quản trị viên (Admin)');
    }
    closeAllDropdowns();
  });
});

/* ============================================================================
   F. HỆ THỐNG MODAL CHUẨN UX (FOCUS TRAP, ESC, STICKY FOOTER, POPSTATE)
   ============================================================================ */
let lastFocusedElement = null;

function openModal({ title, bodyHtml, footerHtml = '' }) {
  lastFocusedElement = document.activeElement;
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = bodyHtml;
  $('#modalFooter').innerHTML = footerHtml;
  $('#modalFooter').style.display = footerHtml ? 'flex' : 'none';
  $('#modalBackdrop').classList.add('open');
  try { history.pushState({ modalOpen: true }, ''); } catch (e) {}
  setTimeout(() => $('#modalDialog').focus(), 30);
}

function closeModal() {
  if (!$('#modalBackdrop').classList.contains('open')) return;
  $('#modalBackdrop').classList.remove('open');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

$('#modalCloseBtn').addEventListener('click', closeModal);
$('#modalBackdrop').addEventListener('click', e => {
  if (e.target === $('#modalBackdrop') || e.target.closest('[data-close-modal]')) closeModal();
});

window.addEventListener('popstate', () => {
  if ($('#modalBackdrop').classList.contains('open')) closeModal();
});

document.addEventListener('keydown', e => {
  if (!$('#modalBackdrop').classList.contains('open')) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal();
    return;
  }
  if (e.key === 'Tab') {
    const focusables = $$('#modalDialog button:not(:disabled), #modalDialog input:not(:disabled), #modalDialog textarea:not(:disabled), #modalDialog select:not(:disabled), #modalDialog [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ============================================================================
   I. TRUST SCORE SIMULATOR (ĐƯA LÊN ĐẦU TRANG & ĐỒNG BỘ HERO CARD)
   ============================================================================ */
const TRUST_SCORE_STATE = { onTime: 95, firstPass: 92, rating: 4.9, disputeRate: 0, cards: 5 };

function renderTrustScoreSimulator() {
  const sliders = [
    ['onTime', 'Tỷ lệ bàn giao đúng hạn', 0, 100, 1, '%'],
    ['firstPass', 'Đạt Checklist ngay lần duyệt đầu', 0, 100, 1, '%'],
    ['rating', 'Đánh giá trung bình từ khách hàng', 1, 5, 0.1, '/5'],
    ['disputeRate', 'Tỷ lệ đơn phát sinh tranh chấp', 0, 20, 1, '%'],
    ['cards', 'Số Thẻ kinh nghiệm đã xác thực', 0, 20, 1, ' thẻ']
  ];
  $('#trustSlidersBox').innerHTML = sliders.map(s => `
    <label for="ts-${s[0]}" style="display:flex;justify-content:space-between;margin:10px 0 4px;font-weight:600;font-size:13.5px">
      <span>${s[1]}</span>
      <output id="ts-out-${s[0]}" style="color:var(--br);font-weight:800">${TRUST_SCORE_STATE[s[0]]}${s[5]}</output>
    </label>
    <input id="ts-${s[0]}" type="range" data-ts-key="${s[0]}" data-unit="${s[5]}" min="${s[2]}" max="${s[3]}" step="${s[4]}" value="${TRUST_SCORE_STATE[s[0]]}" style="width:100%;accent-color:var(--br)">
  `).join('');
  updateTrustScoreCalculation();
}

function getTrustBadgeText(cards, score) {
  if (cards < 3) return 'Đã xác minh danh tính (Cần ≥ 3 thẻ để xếp hạng)';
  if (cards >= 10 && score >= 90) return '★ Tin cậy cao (Top 5%)';
  if (score >= 80) return '✓ Đáng tin cậy';
  return 'Đã xác minh';
}

function updateTrustScoreCalculation() {
  const weights = [
    ['Giao bài đúng hạn', TRUST_SCORE_STATE.onTime, 30],
    ['Đạt chuẩn Checklist lần đầu', TRUST_SCORE_STATE.firstPass, 30],
    ['Đánh giá của khách hàng', (TRUST_SCORE_STATE.rating / 5) * 100, 25],
    ['Không phát sinh khiếu nại', Math.max(0, 100 - TRUST_SCORE_STATE.disputeRate * 5), 15]
  ];
  const score = Math.round(weights.reduce((acc, w) => acc + (w[1] * w[2]) / 100, 0));
  const badgeLabel = getTrustBadgeText(TRUST_SCORE_STATE.cards, score);

  const heroScoreEl = $('#heroLiveScore');
  if (heroScoreEl) heroScoreEl.textContent = score;

  $('#trustResultBox').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px">
      <div>
        <span class="muted2" style="font-size:12px;font-weight:700;text-transform:uppercase">Điểm tin cậy tổng hợp</span>
        <div style="font-size:48px;font-weight:800;color:var(--br);line-height:1">${score}<span style="font-size:18px;color:var(--mut)">/100</span></div>
      </div>
      <span class="tag ${TRUST_SCORE_STATE.cards >= 3 && score >= 80 ? 'ok' : 'nt'}">${badgeLabel}</span>
    </div>
    <hr style="border:0;border-top:1px solid var(--line);margin:14px 0">
    ${weights.map(w => `
      <div class="muted2" style="display:flex;justify-content:space-between;font-size:13px">
        <span>${w[0]} (Trọng số ${w[2]}%)</span>
        <b>${Math.round(w[1])}/100</b>
      </div>
      <div class="bar"><i style="width:${w[1]}%"></i></div>
    `).join('')}
  `;
}
renderTrustScoreSimulator();

$('#trustSlidersBox').addEventListener('input', e => {
  const key = e.target.dataset.tsKey;
  if (!key) return;
  TRUST_SCORE_STATE[key] = Number(e.target.value);
  $(`#ts-out-${key}`).textContent = e.target.value + e.target.dataset.unit;
  updateTrustScoreCalculation();
});

/* ============================================================================
   B & J2: RENDER 3 SINH VIÊN NỔI BẬT + SO SÁNH ỨNG VIÊN SONG SONG
   ============================================================================ */
function buildStudentCardHtml(stu) {
  const isCompared = APP_STATE.comparedStudentIds.includes(stu.id);
  return `
    <article class="pc">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div style="display:flex;gap:12px;align-items:center">
          <div style="width:48px;height:48px;border-radius:14px;background:var(--br);color:#fff;display:grid;place-items:center;font-weight:800;font-size:16px;flex-shrink:0">${stu.code}</div>
          <div>
            <h3 style="margin:0;font-size:16.5px">${escapeHtml(stu.name)}</h3>
            <span class="muted2" style="font-size:12.5px">${escapeHtml(stu.uni)}</span>
          </div>
        </div>
        <span class="tag ok" title="Trust Score">${stu.trustScore}/100</span>
      </div>
      <p class="muted2" style="margin:0;font-size:13.5px">${escapeHtml(stu.headline)}</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${stu.badges.map(b => `<span class="tag nt">${b}</span>`).join('')}
        <span class="tag w2">${stu.cardsCount} Thẻ QR</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;background:var(--bg);padding:8px 10px;border-radius:10px;font-size:12px;text-align:center">
        <div><span class="muted2">Đúng hạn</span><br><b>${stu.onTimeRate}</b></div>
        <div><span class="muted2">Đạt lần 1</span><br><b>${stu.firstPassRate}</b></div>
        <div><span class="muted2">Thuê lại</span><br><b style="color:var(--good)">${stu.rehireRate}</b></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:10px;border-top:1px solid var(--line);gap:8px">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;cursor:pointer">
          <input type="checkbox" data-compare-stu="${stu.id}" ${isCompared ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--br)">
          <span>So sánh</span>
        </label>
        <button class="btn o sm" data-view-stu="${stu.id}">Xem hồ sơ →</button>
      </div>
    </article>
  `;
}

function renderFeaturedAndSimilarStudents() {
  const html = FEATURED_STUDENTS.map(buildStudentCardHtml).join('');
  $('#featuredStudentsGrid').innerHTML = html;
  $('#similarStudentsGrid').innerHTML = html;
  const count = APP_STATE.comparedStudentIds.length;
  $('#compareCountText').textContent = count;
  $('#compareBar').classList.toggle('show', count >= 2);
}
renderFeaturedAndSimilarStudents();

document.addEventListener('change', e => {
  const cmpInput = e.target.closest('[data-compare-stu]');
  if (!cmpInput) return;
  const id = cmpInput.dataset.compareStu;
  if (cmpInput.checked) {
    if (APP_STATE.comparedStudentIds.length >= 3) {
      cmpInput.checked = false;
      showToast('Chỉ chọn tối đa 3 sinh viên để so sánh');
      return;
    }
    APP_STATE.comparedStudentIds.push(id);
  } else {
    APP_STATE.comparedStudentIds = APP_STATE.comparedStudentIds.filter(x => x !== id);
  }
  renderFeaturedAndSimilarStudents();
});

document.addEventListener('click', e => {
  const stuBtn = e.target.closest('[data-view-stu]');
  if (stuBtn) {
    const stu = FEATURED_STUDENTS.find(s => s.id === stuBtn.dataset.viewStu);
    if (stu) {
      $('#profAvatar').textContent = stu.code;
      $('#profName').textContent = stu.name;
      $('#profHeadline').textContent = `${stu.uni} — ${stu.headline}`;
      switchView('profile');
    }
  }
});

$('#clearCompareBtn').addEventListener('click', () => {
  APP_STATE.comparedStudentIds = [];
  renderFeaturedAndSimilarStudents();
});

$('#openCompareModalBtn').addEventListener('click', () => {
  const list = FEATURED_STUDENTS.filter(s => APP_STATE.comparedStudentIds.includes(s.id));
  if (list.length < 2) return;
  openModal({
    title: `So sánh song song (${list.length} ứng viên)`,
    bodyHtml: `
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px">
          <thead>
            <tr style="border-bottom:2px solid var(--line);text-align:left">
              <th style="padding:10px">Tiêu chí</th>
              ${list.map(s => `<th style="padding:10px;color:var(--br)">${escapeHtml(s.name)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--line)"><td style="padding:10px;font-weight:600">Trường đại học</td>${list.map(s => `<td style="padding:10px">${escapeHtml(s.uni)}</td>`).join('')}</tr>
            <tr style="border-bottom:1px solid var(--line)"><td style="padding:10px;font-weight:600">Trust Score</td>${list.map(s => `<td style="padding:10px"><b>${s.trustScore}/100</b></td>`).join('')}</tr>
            <tr style="border-bottom:1px solid var(--line)"><td style="padding:10px;font-weight:600">Số Thẻ kinh nghiệm QR</td>${list.map(s => `<td style="padding:10px">${s.cardsCount} thẻ</td>`).join('')}</tr>
            <tr style="border-bottom:1px solid var(--line)"><td style="padding:10px;font-weight:600">Tỷ lệ đạt chuẩn lần 1</td>${list.map(s => `<td style="padding:10px">${s.firstPassRate}</td>`).join('')}</tr>
            <tr style="border-bottom:1px solid var(--line)"><td style="padding:10px;font-weight:600">Tỷ lệ khách thuê lại</td>${list.map(s => `<td style="padding:10px;color:var(--good);font-weight:700">${s.rehireRate}</td>`).join('')}</tr>
            <tr><td style="padding:10px;font-weight:600">Mức giá gói cơ bản</td>${list.map(s => `<td style="padding:10px">Từ ${formatCurrency(s.minPrice)}</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
    `,
    footerHtml: `<button class="btn" data-close-modal="1">Đóng bảng so sánh</button>`
  });
});

/* ============================================================================
   C & D: DANH SÁCH DỰ ÁN + SEARCH (RECENT + AUTOCOMPLETE) + SORT + FILTER
   ============================================================================ */
function renderCategoryChips() {
  $('#categoryChips').innerHTML = Object.entries(CATEGORIES).map(([key, label]) => {
    const count = key === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.category === key).length;
    return `<button data-cat="${key}" aria-pressed="${APP_STATE.filterCategory === key}">${label} (${count})</button>`;
  }).join('');
}

function getFilteredProjects() {
  const query = normalizeText($('#q').value.trim());
  let list = PROJECTS.filter(p => {
    if (APP_STATE.filterCategory !== 'all' && p.category !== APP_STATE.filterCategory) return false;
    if (APP_STATE.filterOnlyOpen && !p.isOpen) return false;
    if (p.budget < APP_STATE.filterMinBudget) return false;
    if (APP_STATE.filterDuration === 'short' && p.days > 4) return false;
    if (APP_STATE.filterDuration === 'med' && (p.days < 5 || p.days > 7)) return false;
    if (APP_STATE.filterDuration === 'long' && p.days <= 7) return false;
    if (query && !normalizeText(p.title + ' ' + CATEGORIES[p.category] + ' ' + p.clientName).includes(query)) return false;
    return true;
  });

  if (APP_STATE.sortBy === 'budget_desc') list.sort((a, b) => b.budget - a.budget);
  else if (APP_STATE.sortBy === 'deadline_asc') list.sort((a, b) => a.days - b.days);
  else list.sort((a, b) => a.createdOrder - b.createdOrder);
  return list;
}

function renderProjectsGrid() {
  const list = getFilteredProjects();
  if (!list.length) {
    $('#projectsGrid').innerHTML = `
      <div class="tool" style="grid-column:1/-1;text-align:center;padding:36px">
        <h3 style="margin:0 0 8px">Không tìm thấy dự án khớp bộ lọc hiện tại</h3>
        <p class="muted2" style="margin:0 0 16px">Thử tìm với một trong các từ khóa phổ biến dưới đây hoặc đặt lại bộ lọc:</p>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="btn ghost sm" data-quick-q="thời trang">Từ khóa: “thời trang”</button>
          <button class="btn ghost sm" data-quick-q="quán cafe">Từ khóa: “quán cafe”</button>
          <button class="btn sm" id="emptyResetBtn">Xem tất cả dự án</button>
        </div>
      </div>
    `;
    return;
  }

  $('#projectsGrid').innerHTML = list.map(p => {
    const isSaved = APP_STATE.savedProjectIds.includes(p.id);
    return `
      <article class="pc ${p.featured ? 'featured' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${p.featured ? `<span class="tag w2">🔥 Nổi bật • Ngân sách cao</span>` : ''}
            <span class="tag ${p.isOpen ? 'ok' : 'nt'}">${p.isOpen ? '● Đang mở' : '⏳ Giai đoạn 2'}</span>
            <span class="tag nt">${CATEGORIES[p.category]}</span>
          </div>
          <!-- C3 & G3: Nút Lưu dạng icon có vùng chạm 44x44px -->
          <button class="icon-btn" data-save-proj="${p.id}" aria-label="Lưu dự án" title="${isSaved ? 'Bỏ lưu dự án' : 'Lưu dự án'}" style="color:${isSaved ? 'var(--br)' : 'var(--mut)'}">
            ${isSaved ? '🔖' : '☆'}
          </button>
        </div>

        <h3>${escapeHtml(p.title)}</h3>

        <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--mut)">
          <span style="font-size:16px">${p.clientIcon || '🏪'}</span>
          <span>${escapeHtml(p.clientName)}</span>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--mut)">
          <span>🕒 ${escapeHtml(p.postedAgo)}</span>
          <span>👥 ${p.applicants} người đã quan tâm</span>
        </div>

        <div class="pm">
          <div>
            <strong>${formatCurrency(p.budget)}</strong>
            <span style="display:block;font-size:12px">⏱ Hạn giao: ${escapeHtml(p.durationText)}</span>
          </div>
          <!-- C4: 1 CTA duy nhất rõ ràng -->
          <button class="btn ${p.isOpen ? '' : 'ghost'} sm" data-open-proj-id="${p.id}">
            ${p.isOpen ? 'Xem chi tiết →' : 'Báo khi mở'}
          </button>
        </div>
      </article>
    `;
  }).join('');
}

renderCategoryChips();
renderProjectsGrid();

/* D1 & D2: Search Autocomplete & Recent Searches */
function renderSearchDropdown() {
  const val = $('#q').value.trim();
  const norm = normalizeText(val);
  const box = $('#searchDropdown');

  if (!val) {
    box.innerHTML = `
      <div style="font-size:11.5px;font-weight:700;color:var(--mut);padding:4px 8px;text-transform:uppercase">Tìm kiếm gần đây</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;padding:6px">
        ${APP_STATE.recentSearches.map(s => `<button class="btn ghost sm" data-pick-search="${escapeHtml(s)}" style="min-height:32px;padding:4px 10px">${escapeHtml(s)}</button>`).join('')}
      </div>
    `;
  } else {
    const matches = PROJECTS.filter(p => normalizeText(p.title + ' ' + CATEGORIES[p.category]).includes(norm)).slice(0, 5);
    box.innerHTML = matches.length
      ? matches.map(m => `
          <button class="dd-item" data-pick-search="${escapeHtml(m.title)}" style="min-height:38px">
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(m.title)}</span>
            <span class="tag nt">${formatCurrency(m.budget)}</span>
          </button>
        `).join('')
      : `<div class="muted2" style="padding:8px 12px">Nhấn Enter để tìm “${escapeHtml(val)}”</div>`;
  }
  box.classList.add('open');
}

$('#q').addEventListener('focus', renderSearchDropdown);
$('#q').addEventListener('input', () => {
  renderSearchDropdown();
  renderProjectsGrid();
});

function executeSearch(term) {
  if (term !== undefined) $('#q').value = term;
  const clean = $('#q').value.trim();
  if (clean) {
    APP_STATE.recentSearches = [clean, ...APP_STATE.recentSearches.filter(x => x !== clean)].slice(0, 5);
    try { localStorage.setItem('veriwork_recent_searches', JSON.stringify(APP_STATE.recentSearches)); } catch (e) {}
  }
  $('#searchDropdown').classList.remove('open');
  renderProjectsGrid();
  document.getElementById('du-an').scrollIntoView({ behavior: 'smooth' });
}

$('#go').addEventListener('click', () => executeSearch());
$('#q').addEventListener('keydown', e => { if (e.key === 'Enter') executeSearch(); });

/* Sự kiện lọc & sắp xếp dự án */
$('#toggleAdvFilterBtn').addEventListener('click', () => {
  const panel = $('#advFilterPanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});
$('#sortSelect').addEventListener('change', e => {
  APP_STATE.sortBy = e.target.value;
  renderProjectsGrid();
});
$('#filterBudgetRange').addEventListener('input', e => {
  APP_STATE.filterMinBudget = Number(e.target.value);
  $('#filterBudgetVal').textContent = formatCurrency(APP_STATE.filterMinBudget);
  renderProjectsGrid();
});
$('#onlyOpenCheckbox').addEventListener('change', e => {
  APP_STATE.filterOnlyOpen = e.target.checked;
  renderProjectsGrid();
});
$('#durationFilterChips').addEventListener('click', e => {
  const btn = e.target.closest('[data-dur]');
  if (!btn) return;
  APP_STATE.filterDuration = btn.dataset.dur;
  $$('#durationFilterChips button').forEach(b => b.setAttribute('aria-pressed', b === btn));
  renderProjectsGrid();
});

function resetProjectFilters() {
  APP_STATE.filterCategory = 'all';
  APP_STATE.filterMinBudget = 0;
  APP_STATE.filterDuration = 'all';
  APP_STATE.filterOnlyOpen = false;
  $('#q').value = '';
  $('#filterBudgetRange').value = 0;
  $('#filterBudgetVal').textContent = '0đ';
  $('#onlyOpenCheckbox').checked = false;
  $$('#durationFilterChips button').forEach(b => b.setAttribute('aria-pressed', b.dataset.dur === 'all'));
  renderCategoryChips();
  renderProjectsGrid();
}
$('#resetFiltersBtn').addEventListener('click', resetProjectFilters);

document.addEventListener('click', e => {
  const catBtn = e.target.closest('[data-cat]');
  if (catBtn) {
    APP_STATE.filterCategory = catBtn.dataset.cat;
    renderCategoryChips();
    renderProjectsGrid();
    return;
  }
  const pickSearch = e.target.closest('[data-pick-search]');
  if (pickSearch) {
    executeSearch(pickSearch.dataset.pickSearch);
    return;
  }
  const quickQ = e.target.closest('[data-quick-q]');
  if (quickQ) {
    resetProjectFilters();
    executeSearch(quickQ.dataset.quickQ);
    return;
  }
  if (e.target.closest('#emptyResetBtn')) {
    resetProjectFilters();
    return;
  }
  const saveBtn = e.target.closest('[data-save-proj]');
  if (saveBtn) {
    const pid = saveBtn.dataset.saveProj;
    if (APP_STATE.savedProjectIds.includes(pid)) {
      APP_STATE.savedProjectIds = APP_STATE.savedProjectIds.filter(id => id !== pid);
      showToast('Đã bỏ lưu dự án');
    } else {
      APP_STATE.savedProjectIds.push(pid);
      showToast('🔖 Đã lưu dự án vào mục Tài khoản & Ví');
    }
    renderProjectsGrid();
    renderSavedProjectsInAccount();
    return;
  }
  const openProj = e.target.closest('[data-open-proj-id]');
  if (openProj) {
    const proj = PROJECTS.find(p => p.id === openProj.dataset.openProjId);
    if (!proj) return;
    if (!proj.isOpen) {
      showToast('🔔 Đã đăng ký nhận thông báo ngay khi ngách này mở!');
      return;
    }
    showProjectDetailModal(proj);
  }
});

function showProjectDetailModal(proj) {
  openModal({
    title: proj.title,
    bodyHtml: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        <span class="tag ok">Ngân sách Escrow: ${formatCurrency(proj.budget)}</span>
        <span class="tag nt">⏱ Hạn giao: ${escapeHtml(proj.durationText)}</span>
        <span class="tag w2">Phí sinh viên: 0đ</span>
      </div>
      <p class="muted2" style="margin:0 0 12px"><b>Khách hàng:</b> ${escapeHtml(proj.clientName)}</p>
      <div style="background:var(--bg);padding:14px;border-radius:12px;border:1px solid var(--line);margin-bottom:16px">
        <b>Mô tả công việc (Brief):</b>
        <p class="muted2" style="margin:6px 0 0">${escapeHtml(proj.brief)}</p>
      </div>
      <b>Checklist nghiệm thu 2 lớp:</b>
      <div style="margin-top:8px">
        ${proj.checklist.map(item => `<div class="fl"><span>✓</span><span>${escapeHtml(item)}</span></div>`).join('')}
      </div>
    `,
    footerHtml: `
      <button class="btn ghost" data-close-modal="1">Đóng</button>
      <button class="btn" id="modalStartWorkspaceBtn">⚡ Nhận dự án & Mở Phòng làm việc</button>
    `
  });

  $('#modalStartWorkspaceBtn').addEventListener('click', () => {
    APP_STATE.pendingSubmission.projectTitle = proj.title;
    APP_STATE.pendingSubmission.clientName = proj.clientName;
    APP_STATE.pendingSubmission.budget = proj.budget;
    closeModal();
    switchView('workspace');
    showToast('⚡ Đã chuyển dự án vào Phòng làm việc!');
  });
}

/* ============================================================================
   E. FORM ĐĂNG DỰ ÁN THÔNG MINH (INLINE VALIDATION, CHAR COUNTER, AUTO-SAVE, PREVIEW)
   ============================================================================ */
const PROHIBITED_RULES = [
  [/dat coc|nop phi|dong phi|phi dao tao|ung tien|chuyen khoan truoc|phi giu cho/, 'Yêu cầu sinh viên đóng phí / đặt cọc', 'Cấm mọi hình thức thu tiền hoặc bắt sinh viên đặt cọc.'],
  [/cccd|can cuoc|mat khau|password|otp|so tai khoan/, 'Đòi giấy tờ nhạy cảm hoặc mật khẩu', 'Khách hàng không được đòi CCCD hay OTP. Việc xác minh do nền tảng thực hiện.'],
  [/da cap|mlm|keo nguoi/, 'Dấu hiệu tuyển dụng đa cấp', 'Các dự án đa cấp bị đình chỉ vĩnh viễn.'],
  [/seeding|danh gia ao|danh gia gia|review ao|comment ao|tuong tac ao/, 'Seeding giả / Đánh giá ảo', 'Nền tảng không nhận dự án tạo đánh giá giả mạo.']
];

function openPostProjectModal() {
  const savedDraft = JSON.parse(localStorage.getItem('veriwork_post_draft') || '{}');
  openModal({
    title: 'Đăng dự án mới (Tự động gợi ý giá & Tạo Checklist)',
    bodyHtml: `
      <div class="tool" style="box-shadow:none;padding:0;border:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span class="tag ok" id="draftSavedIndicator">💾 Tự động lưu nháp</span>
          <span class="muted2" style="font-size:12px">Không phí đăng tin • Chỉ thu 10% khi hoàn thành</span>
        </div>

        <div style="margin-bottom:12px">
          <label for="postTitleInput"><b>Tiêu đề dự án *</b></label>
          <input id="postTitleInput" type="text" placeholder="VD: Viết mô tả cho 20 sản phẩm thời trang nữ" value="${escapeHtml(savedDraft.title || '')}" style="margin-top:4px">
          <div class="field-err" id="errPostTitle"></div>
        </div>

        <div class="form-grid-2" style="margin-bottom:12px">
          <div>
            <label for="postItemCount"><b>Số lượng bài / sản phẩm *</b></label>
            <input id="postItemCount" type="number" min="1" max="200" value="${savedDraft.count || 20}" style="margin-top:4px">
          </div>
          <div>
            <label for="postDaysInput"><b>Thời hạn (số ngày) *</b></label>
            <input id="postDaysInput" type="number" min="1" max="30" value="${savedDraft.days || 5}" style="margin-top:4px">
          </div>
        </div>

        <!-- E6: Ước tính mức giá gợi ý tự động -->
        <div style="background:var(--ob);border:1px solid var(--br);border-radius:10px;padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <span style="font-size:13px;font-weight:600;color:var(--br)" id="priceEstimateText">💡 Gợi ý ngân sách: 500.000đ – 700.000đ (dựa trên 15 dự án tương tự)</span>
          <button type="button" class="btn ghost sm" id="applySuggestedPriceBtn" style="min-height:30px;padding:3px 10px;background:var(--s)">Áp dụng</button>
        </div>

        <div style="margin-bottom:12px">
          <label for="postBudgetInput"><b>Ngân sách dự án (VNĐ) *</b></label>
          <input id="postBudgetInput" type="number" min="100000" step="50000" value="${savedDraft.budget || 600000}" style="margin-top:4px">
          <div class="field-err" id="errPostBudget"></div>
        </div>

        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <label for="postBriefInput"><b>Mô tả chi tiết & Tiêu chuẩn nghiệm thu *</b></label>
            <!-- E2: Character counter -->
            <span class="muted2" style="font-size:12px" id="briefCharCounter">0/500 ký tự</span>
          </div>
          <textarea id="postBriefInput" maxlength="500" placeholder="Nêu rõ độ dài mỗi bài, từ khóa cần chèn, giọng văn và yêu cầu bàn giao..." style="margin-top:4px">${escapeHtml(savedDraft.brief || '')}</textarea>
          <div class="field-err" id="errPostBrief"></div>
        </div>

        <!-- E5: Kéo thả tài liệu Brief đính kèm -->
        <div class="dropzone" id="postBriefDropzone">
          <input type="file" id="postBriefFile" style="display:none">
          <div id="postDropzoneLabel" class="muted2" style="font-size:13px">📎 Kéo thả ảnh sản phẩm hoặc file Brief (.pdf, .docx) vào đây</div>
        </div>

        <div id="postPreviewBox" style="display:none;margin-top:14px;background:var(--s2);padding:14px;border-radius:12px;border:1px solid var(--line)"></div>
      </div>
    `,
    footerHtml: `
      <button class="btn ghost" id="previewPostBtn">👁️ Xem trước</button>
      <button class="btn" id="submitNewProjectBtn">Đăng dự án ngay</button>
    `
  });

  const titleEl = $('#postTitleInput');
  const countEl = $('#postItemCount');
  const daysEl = $('#postDaysInput');
  const budgetEl = $('#postBudgetInput');
  const briefEl = $('#postBriefInput');

  function updateSuggestedPrice() {
    const cnt = Math.max(1, Number(countEl.value) || 10);
    const minP = cnt * 25000;
    const maxP = cnt * 35000;
    $('#priceEstimateText').textContent = `💡 Gợi ý cho ${cnt} bài: ${formatCurrency(minP)} – ${formatCurrency(maxP)} (dựa trên 15 dự án tương tự)`;
    $('#applySuggestedPriceBtn').dataset.suggest = Math.round((minP + maxP) / 2);
  }

  function updateCharCounter() {
    $('#briefCharCounter').textContent = `${briefEl.value.length}/500 ký tự`;
  }

  function saveDraft() {
    try {
      localStorage.setItem('veriwork_post_draft', JSON.stringify({
        title: titleEl.value,
        count: countEl.value,
        days: daysEl.value,
        budget: budgetEl.value,
        brief: briefEl.value
      }));
      $('#draftSavedIndicator').textContent = '💾 Đã lưu nháp tự động';
    } catch (e) {}
  }

  function validateField(field) {
    let ok = true;
    if (field === 'title' || !field) {
      if (titleEl.value.trim().length < 10) {
        titleEl.classList.add('invalid');
        $('#errPostTitle').textContent = 'Tiêu đề cần ít nhất 10 ký tự để sinh viên hiểu rõ đầu việc.';
        ok = false;
      } else {
        titleEl.classList.remove('invalid');
        $('#errPostTitle').textContent = '';
      }
    }
    if (field === 'budget' || !field) {
      if (Number(budgetEl.value) < 100000) {
        budgetEl.classList.add('invalid');
        $('#errPostBudget').textContent = 'Ngân sách tối thiểu là 100.000đ.';
        ok = false;
      } else {
        budgetEl.classList.remove('invalid');
        $('#errPostBudget').textContent = '';
      }
    }
    if (field === 'brief' || !field) {
      const violation = PROHIBITED_RULES.find(r => r[0].test(normalizeText(titleEl.value + ' ' + briefEl.value)));
      if (violation) {
        briefEl.classList.add('invalid');
        $('#errPostBrief').textContent = `⛔ Chặn tự động: ${violation[1]} (${violation[2]})`;
        ok = false;
      } else if (briefEl.value.trim().length < 20) {
        briefEl.classList.add('invalid');
        $('#errPostBrief').textContent = 'Vui lòng mô tả ít nhất 20 ký tự về tiêu chuẩn sản phẩm bàn giao.';
        ok = false;
      } else {
        briefEl.classList.remove('invalid');
        $('#errPostBrief').textContent = '';
      }
    }
    return ok;
  }

  titleEl.addEventListener('blur', () => validateField('title'));
  budgetEl.addEventListener('blur', () => validateField('budget'));
  briefEl.addEventListener('blur', () => validateField('brief'));
  briefEl.addEventListener('input', () => { updateCharCounter(); validateField('brief'); saveDraft(); });
  titleEl.addEventListener('input', saveDraft);
  countEl.addEventListener('input', () => { updateSuggestedPrice(); saveDraft(); });

  $('#applySuggestedPriceBtn').addEventListener('click', e => {
    budgetEl.value = e.target.dataset.suggest || 600000;
    validateField('budget');
    saveDraft();
  });

  // Upload file drag & drop
  const dz = $('#postBriefDropzone');
  const fi = $('#postBriefFile');
  dz.addEventListener('click', () => fi.click());
  fi.addEventListener('change', () => {
    if (fi.files[0]) $('#postDropzoneLabel').innerHTML = `✅ Đã đính kèm: <b>${escapeHtml(fi.files[0].name)}</b>`;
  });

  // E3: Xem trước dự án
  $('#previewPostBtn').addEventListener('click', () => {
    if (!validateField()) return;
    const box = $('#postPreviewBox');
    box.style.display = 'block';
    box.innerHTML = `
      <div class="tag ok" style="margin-bottom:6px">Bản xem trước hiển thị với Sinh viên</div>
      <h4 style="margin:0 0 4px">${escapeHtml(titleEl.value)}</h4>
      <p class="muted2" style="margin:0 0 8px">${escapeHtml(briefEl.value)}</p>
      <div style="font-weight:700;color:var(--br)">Ngân sách: ${formatCurrency(budgetEl.value)} • Hạn giao: ${Number(daysEl.value) || 5} ngày</div>
    `;
  });

  $('#submitNewProjectBtn').addEventListener('click', () => {
    if (!validateField()) return;
    const newId = 'proj-' + (PROJECTS.length + 1);
    const daysNum = Math.max(1, Number(daysEl.value) || 5);
    PROJECTS.unshift({
      id: newId,
      title: titleEl.value.trim(),
      category: 'viet',
      budget: Number(budgetEl.value),
      days: daysNum,
      durationText: `${daysNum} ngày`,
      isOpen: true,
      featured: Number(budgetEl.value) >= 700000,
      postedAgo: 'Vừa đăng xong',
      createdOrder: 0,
      applicants: 1,
      clientIcon: '🏪',
      clientName: 'Doanh nghiệp của bạn (Đã xác minh)',
      brief: briefEl.value.trim(),
      checklist: [
        `Bàn giao đủ ${Number(countEl.value) || 15} bài theo đúng Brief`,
        'Nội dung độc bản 100%, chuẩn từ khóa yêu cầu',
        `Hoàn thành trong thời hạn ${daysNum} ngày`
      ]
    });
    try { localStorage.removeItem('veriwork_post_draft'); } catch (e) {}
    closeModal();
    resetProjectFilters();
    switchView('projects');
    showToast('✅ Đã đăng dự án mới thành công!');
  });

  updateSuggestedPrice();
  updateCharCounter();
}

$('#openPostBtn').addEventListener('click', openPostProjectModal);
$('#footerPostBtn').addEventListener('click', openPostProjectModal);

/* ============================================================================
   DỊCH VỤ ĐÓNG GÓI & CÁCH HOẠT ĐỘNG
   ============================================================================ */
const SERVICE_GIGS = [
  {
    studentName: 'Nguyễn Phương Thảo', uni: 'ĐH Thăng Long', cards: 3, score: 92,
    title: 'Viết mô tả sản phẩm Thời trang chuẩn SEO cho Shop Online',
    tiers: [
      { name: 'Cơ bản', price: 150000, days: 2, rev: 1, items: ['5 bài mô tả (80–100 từ/bài)', 'Tối ưu 1 từ khóa chính'] },
      { name: 'Tiêu chuẩn', price: 280000, days: 4, rev: 2, items: ['10 bài mô tả (100–130 từ/bài)', 'Từ khóa chính & phụ', 'Kiểm tra độc bản 100%'] },
      { name: 'Cao cấp', price: 500000, days: 6, rev: 2, items: ['20 bài mô tả (100–150 từ/bài)', 'Từ khóa chính & phụ', 'Bảng phân bổ từ khóa SEO'] }
    ]
  },
  {
    studentName: 'Trần Quốc Bảo', uni: 'ĐH Bách khoa Hà Nội', cards: 4, score: 89,
    title: 'Gói bài đăng Fanpage & Lịch nội dung cho Quán Cafe',
    tiers: [
      { name: 'Cơ bản', price: 140000, days: 2, rev: 1, items: ['5 bài đăng ngắn bắt trend', 'Bộ hashtag định vị khu vực'] },
      { name: 'Tiêu chuẩn', price: 260000, days: 4, rev: 2, items: ['12 bài đăng theo giọng quán', 'Lịch đăng bài chi tiết 1 tuần', 'Gợi ý góc chụp ảnh'] },
      { name: 'Cao cấp', price: 450000, days: 6, rev: 2, items: ['20 bài đăng đa chủ đề', 'Lịch nội dung 2 tuần', 'Kịch bản 1 minigame tương tác'] }
    ]
  },
  {
    studentName: 'Lê Thu Hà', uni: 'ĐH Ngoại thương', cards: 11, score: 96,
    title: 'Mô tả sản phẩm Thủ công & Quà tặng theo lối kể chuyện',
    tiers: [
      { name: 'Cơ bản', price: 180000, days: 3, rev: 1, items: ['4 bài mô tả giàu cảm xúc', 'Tối ưu từ khóa tìm kiếm'] },
      { name: 'Tiêu chuẩn', price: 330000, days: 5, rev: 2, items: ['8 bài mô tả kể chuyện', 'Gợi ý bố cục chụp ảnh', 'Cam kết độc bản 100%'] },
      { name: 'Cao cấp', price: 600000, days: 7, rev: 2, items: ['16 bài mô tả chuyên sâu', 'Gợi ý bố cục ảnh', 'Tặng 1 mẫu thư cảm ơn khách hàng'] }
    ]
  }
];
const SERVICE_TIER_STATE = [1, 1, 1];

function renderServicesGrid() {
  $('#servicesGrid').innerHTML = SERVICE_GIGS.map((gig, idx) => {
    const tier = gig.tiers[SERVICE_TIER_STATE[idx]];
    return `
      <article class="pc">
        <div style="display:flex;justify-content:space-between;gap:6px">
          <span class="tag ok">Trust Score: ${gig.score}/100</span>
          <span class="tag nt">${gig.cards} Thẻ QR</span>
        </div>
        <h3>${escapeHtml(gig.title)}</h3>
        <p class="muted2" style="margin:0">👤 <b>${escapeHtml(gig.studentName)}</b> (${escapeHtml(gig.uni)})</p>
        <div class="tb" style="width:100%;justify-content:space-between">
          ${gig.tiers.map((t, tIdx) => `<button style="flex:1" data-gig-tier="${idx}:${tIdx}" aria-pressed="${SERVICE_TIER_STATE[idx] === tIdx}">${t.name}</button>`).join('')}
        </div>
        <div style="margin:4px 0">
          ${tier.items.map(it => `<div class="muted2" style="padding:2px 0">✓ ${escapeHtml(it)}</div>`).join('')}
        </div>
        <div class="pm">
          <div>
            <strong>${formatCurrency(tier.price)}</strong>
            <span style="display:block;font-size:12px">⏱ ${tier.days} ngày • ${tier.rev} vòng sửa</span>
          </div>
          <button class="btn sm" data-order-gig="${idx}">Đặt gói này</button>
        </div>
      </article>
    `;
  }).join('');
}
renderServicesGrid();

document.addEventListener('click', e => {
  const tierBtn = e.target.closest('[data-gig-tier]');
  if (tierBtn) {
    const [gIdx, tIdx] = tierBtn.dataset.gigTier.split(':').map(Number);
    SERVICE_TIER_STATE[gIdx] = tIdx;
    renderServicesGrid();
    return;
  }
  const orderBtn = e.target.closest('[data-order-gig]');
  if (orderBtn) {
    const gig = SERVICE_GIGS[Number(orderBtn.dataset.orderGig)];
    const tier = gig.tiers[SERVICE_TIER_STATE[Number(orderBtn.dataset.orderGig)]];
    $('#serviceOrderSummary').innerHTML = `
      <div class="tool" style="border-color:var(--br);background:var(--ob)">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <div>
            <span class="tag ok">Đã tạo Checklist tự động từ gói ${tier.name}</span>
            <h3 style="margin:6px 0 4px">${escapeHtml(gig.title)} — ${formatCurrency(tier.price)}</h3>
            <p class="muted2" style="margin:0">Người thực hiện: <b>${escapeHtml(gig.studentName)}</b> • Thời hạn: ${tier.days} ngày • Bảo vệ thanh toán qua Escrow.</p>
          </div>
          <button class="btn" id="confirmServiceOrderBtn">Xác nhận nạp Escrow & Mở đơn</button>
        </div>
      </div>
    `;
    $('#confirmServiceOrderBtn').addEventListener('click', () => {
      $('#serviceOrderSummary').innerHTML = '';
      switchView('workspace');
      showToast('🛡️ Đã nạp Escrow & khởi tạo Phòng làm việc!');
    });
  }
});

/* Cách hoạt động */
const HOW_STEPS = {
  sv: [
    ['Xác minh .edu.vn & Mở hồ sơ', 'Đăng ký bằng email trường hoặc CCCD. Sở hữu ngay trang hồ sơ công khai kèm đường dẫn đẹp để gắn vào CV.'],
    ['Nhận dự án & Tự check Lớp 1', 'Làm bài theo Brief chuẩn hóa. Tự rà soát từng mục trên Checklist tương tác trước khi nộp lên Admin duyệt Lớp 2.'],
    ['Nhận tiền & Thẻ kinh nghiệm QR', 'Nhận 100% thù lao sau khi khách xác nhận. Chủ động bật/tắt xuất bản sản phẩm vào Portfolio theo Portfolio License.']
  ],
  kh: [
    ['Đăng dự án & Tạo Checklist', 'Điền biểu mẫu có gợi ý mức giá tự động. Hệ thống chuyển hóa yêu cầu thành Checklist nghiệm thu rõ ràng.'],
    ['Chọn sinh viên theo Trust Score', 'Xem Thẻ kinh nghiệm thật và so sánh song song các ứng viên dựa trên tỷ lệ đạt chuẩn ngay lần đầu.'],
    ['Nghiệm thu 2 lớp & Bảo vệ tiền', 'Ngân sách được giữ an toàn. Bạn chỉ giải ngân khi sản phẩm đã qua kiểm duyệt của Admin và đúng yêu cầu.']
  ]
};
function renderHowSteps(roleKey) {
  $('#howStepsGrid').innerHTML = HOW_STEPS[roleKey].map((st, i) => `
    <div class="st-card">
      <div class="st-num">${i + 1}</div>
      <h4>${st[0]}</h4>
      <p>${st[1]}</p>
    </div>
  `).join('');
}
renderHowSteps('sv');
$('#howRoleSwitch').addEventListener('click', e => {
  const btn = e.target.closest('[data-how-role]');
  if (!btn) return;
  $$('#howRoleSwitch button').forEach(b => b.setAttribute('aria-pressed', b === btn));
  renderHowSteps(btn.dataset.howRole);
});

/* ============================================================================
   VIEW 2: HỒ SƠ NĂNG LỰC (PORTFOLIO LICENSE, LINKEDIN IMPORT, SKILL QUIZ)
   ============================================================================ */
function renderProfileTimelineAndLogs() {
  $('#portfolioTimelineList').innerHTML = PORTFOLIO_ITEMS.map((item, idx) => `
    <div class="tool" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap">
        <div>
          <span class="tag ok">${item.code}</span>
          <span class="tag nt">${item.date} • ${item.rating}</span>
          <h4 style="margin:8px 0 4px;font-size:16px">${escapeHtml(item.title)}</h4>
          <p class="muted2" style="margin:0 0 8px">Khách hàng: ${escapeHtml(item.client)}</p>
        </div>
        <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;cursor:pointer">
          <span>Xuất bản Portfolio</span>
          <span class="switch">
            <input type="checkbox" data-toggle-pub="${idx}" ${item.published ? 'checked' : ''}>
            <span class="slider"></span>
          </span>
        </label>
      </div>
      <div style="background:var(--bg);padding:10px 12px;border-radius:10px;border:1px solid var(--line);font-size:13px;color:var(--mut)">
        ${item.published ? escapeHtml(item.excerpt) : '🔒 <i>Đang ẩn trích dẫn sản phẩm — Chỉ hiển thị Thẻ kinh nghiệm xác thực vai trò & kết quả nghiệm thu.</i>'}
      </div>
    </div>
  `).join('');

  $('#profileActivityLog').innerHTML = ACTIVITY_LOGS.map(l => `
    <div class="fl" style="flex-direction:column;gap:2px">
      <span style="font-size:11.5px;font-weight:700;color:var(--br)">${escapeHtml(l.time)}</span>
      <span class="muted2" style="font-size:13px">${escapeHtml(l.text)}</span>
    </div>
  `).join('');
}
renderProfileTimelineAndLogs();

document.addEventListener('change', e => {
  const pubToggle = e.target.closest('[data-toggle-pub]');
  if (!pubToggle) return;
  const idx = Number(pubToggle.dataset.togglePub);
  PORTFOLIO_ITEMS[idx].published = pubToggle.checked;
  ACTIVITY_LOGS.unshift({
    time: `${formatToday()} • Vừa xong`,
    text: `Sinh viên đã ${pubToggle.checked ? 'bật' : 'tắt'} hiển thị Portfolio License cho thẻ ${PORTFOLIO_ITEMS[idx].code}.`
  });
  renderProfileTimelineAndLogs();
  showToast(pubToggle.checked ? '✓ Đã xuất bản vào Portfolio công khai' : '🔒 Đã ẩn chi tiết sản phẩm khỏi Portfolio');
});

/* J4: Import từ LinkedIn */
$('#importLinkedInBtn').addEventListener('click', () => {
  openModal({
    title: 'Đồng bộ thông tin từ LinkedIn',
    bodyHtml: `
      <p class="muted2" style="margin-top:0">Dán đường dẫn trang cá nhân LinkedIn của bạn để hệ thống tự động điền trường học, chuyên ngành và giới thiệu ngắn.</p>
      <label for="liUrlInput"><b>Đường dẫn LinkedIn Profile</b></label>
      <input id="liUrlInput" type="text" value="https://www.linkedin.com/in/minhanh-neu-marketing" style="margin-top:6px">
    `,
    footerHtml: `
      <button class="btn ghost" data-close-modal="1">Hủy</button>
      <button class="btn" id="confirmImportLiBtn">Đồng bộ ngay</button>
    `
  });
  $('#confirmImportLiBtn').addEventListener('click', () => {
    $('#profHeadline').textContent = 'Sinh viên năm 3 Marketing (ĐH Kinh tế Quốc dân) — Chuyên viết nội dung SEO & Thương mại điện tử (Đã đồng bộ LinkedIn).';
    closeModal();
    showToast('🔗 Đã cập nhật thông tin từ LinkedIn thành công!');
  });
});

/* J (P2): Skill Assessment Quiz (Bài test kỹ năng 5 phút) */
$('#takeSkillQuizBtn').addEventListener('click', () => {
  openModal({
    title: 'Bài kiểm tra kỹ năng: Viết mô tả sản phẩm chuẩn SEO',
    bodyHtml: `
      <p class="muted2" style="margin-top:0">Hoàn thành đúng 2 câu hỏi tình huống thực tế để nhận huy hiệu <b>🏅 Đã kiểm tra kỹ năng SEO</b> trên hồ sơ.</p>
      <div style="margin-bottom:14px">
        <b>Câu 1: Khi viết mô tả sản phẩm thời trang 120 từ, vị trí đặt từ khóa chính tốt nhất là ở đâu?</b>
        <label class="fl"><input type="radio" name="q1" value="a"><span>Nhồi lặp lại 10 lần ở cuối bài viết.</span></label>
        <label class="fl"><input type="radio" name="q1" value="b" checked><span>Xuất hiện tự nhiên trong tiêu đề phụ và 50 từ đầu tiên.</span></label>
      </div>
      <div>
        <b>Câu 2: Thông tin nào giúp giảm tỷ lệ đổi trả hàng nhiều nhất khi mua quần áo online?</b>
        <label class="fl"><input type="radio" name="q2" value="a" checked><span>Thông số kích thước 3 vòng theo từng size (S/M/L) và độ co giãn của vải.</span></label>
        <label class="fl"><input type="radio" name="q2" value="b"><span>Các tính từ khen ngợi chung chung như “siêu đẹp, tuyệt vời”.</span></label>
      </div>
    `,
    footerHtml: `
      <button class="btn ghost" data-close-modal="1">Để sau</button>
      <button class="btn" id="submitQuizBtn">Nộp bài & Nhận Badge</button>
    `
  });
  $('#submitQuizBtn').addEventListener('click', () => {
    $('#skillQuizBadge').style.display = 'inline-flex';
    closeModal();
    showToast('🏅 Chúc mừng! Bạn đạt 2/2 câu và nhận huy hiệu Đã kiểm tra kỹ năng SEO.');
  });
});

$('#editProfileBtn').addEventListener('click', () => {
  openModal({
    title: 'Chỉnh sửa Hồ sơ năng lực',
    bodyHtml: `
      <div style="margin-bottom:12px">
        <label><b>Họ và tên hiển thị</b></label>
        <input id="editNameInp" type="text" value="${escapeHtml($('#profName').textContent)}" style="margin-top:4px">
      </div>
      <div>
        <label><b>Headline giới thiệu (1 câu ngắn gọn)</b></label>
        <textarea id="editHeadlineInp" style="margin-top:4px">${escapeHtml($('#profHeadline').textContent)}</textarea>
      </div>
    `,
    footerHtml: `
      <button class="btn ghost" data-close-modal="1">Hủy</button>
      <button class="btn" id="saveProfBtn">Lưu thay đổi</button>
    `
  });
  $('#saveProfBtn').addEventListener('click', () => {
    $('#profName').textContent = $('#editNameInp').value.trim() || 'Nguyễn Phương Thảo';
    $('#profHeadline').textContent = $('#editHeadlineInp').value.trim();
    closeModal();
    showToast('✓ Đã lưu thông tin hồ sơ');
  });
});

$('#shareProfileBtn').addEventListener('click', () => {
  openModal({
    title: 'Chia sẻ Hồ sơ năng lực & Mã QR',
    bodyHtml: `
      <div style="text-align:center;padding:10px">
        <div style="width:140px;height:140px;margin:0 auto 12px;padding:10px;background:#fff;border-radius:14px;border:1px solid var(--line)">
          ${generateQrSvg('https://veriwork.vn/u/minhanh')}
        </div>
        <p class="muted2">Quét mã QR để mở hồ sơ xác thực hoặc sao chép đường dẫn gắn vào CV:</p>
        <input type="text" readonly value="https://veriwork.vn/u/minhanh" style="text-align:center;font-weight:700">
      </div>
    `,
    footerHtml: `<button class="btn" id="copyProfileUrlBtn">📋 Sao chép đường dẫn</button>`
  });
  $('#copyProfileUrlBtn').addEventListener('click', () => {
    closeModal();
    showToast('📋 Đã sao chép https://veriwork.vn/u/minhanh');
  });
});

$('#rehireBtn').addEventListener('click', openPostProjectModal);

/* ============================================================================
   VIEW 3: TÀI KHOẢN & VÍ THU NHẬP
   ============================================================================ */
function renderWalletAndAccount() {
  const formatted = formatCurrency(APP_STATE.walletBalance);
  $('#walletBalanceText').textContent = formatted;
  $('#ddWalletTag').textContent = Math.round(APP_STATE.walletBalance / 1000) + 'k';
  $('#walletHistoryList').innerHTML = WALLET_HISTORY.map(h => `
    <div class="fl" style="justify-content:space-between;align-items:center">
      <div>
        <b>${escapeHtml(h.title)}</b>
        <div class="muted2" style="font-size:12px">${escapeHtml(h.date)} • ${escapeHtml(h.status)}</div>
      </div>
      <b style="color:var(--good)">${escapeHtml(h.amount)}</b>
    </div>
  `).join('');
  renderSavedProjectsInAccount();
}

function renderSavedProjectsInAccount() {
  const savedList = PROJECTS.filter(p => APP_STATE.savedProjectIds.includes(p.id));
  $('#savedProjectsList').innerHTML = savedList.length
    ? savedList.map(p => `
        <div class="fl" style="justify-content:space-between;align-items:center">
          <div>
            <b>${escapeHtml(p.title)}</b>
            <div class="muted2" style="font-size:12px">${formatCurrency(p.budget)} • ${escapeHtml(p.durationText)}</div>
          </div>
          <button class="btn o sm" data-open-proj-id="${p.id}">Xem</button>
        </div>
      `).join('')
    : `<p class="muted2" style="margin:0">Bạn chưa lưu dự án nào. Bấm biểu tượng ☆ trên mỗi thẻ dự án để lưu lại.</p>`;
}
renderWalletAndAccount();

$('#withdrawBtn').addEventListener('click', () => {
  if (APP_STATE.walletBalance <= 0) {
    showToast('Số dư khả dụng đã được rút hết');
    return;
  }
  openModal({
    title: 'Yêu cầu rút tiền về tài khoản ngân hàng',
    bodyHtml: `
      <p class="muted2" style="margin-top:0">Tiền được chuyển trong 1–3 ngày làm việc. Khoản chi trả dưới 5.000.000đ/lần không khấu trừ thuế TNCN tại nguồn.</p>
      <div style="margin-bottom:12px">
        <label><b>Ngân hàng thụ hưởng (Chính chủ trùng CCCD)</b></label>
        <input type="text" value="Vietcombank — 0011004298xxx — NGUYEN MINH ANH" readonly style="margin-top:4px">
      </div>
      <div>
        <label><b>Số tiền rút</b></label>
        <input type="text" value="${formatCurrency(APP_STATE.walletBalance)}" readonly style="margin-top:4px;font-weight:700;color:var(--good)">
      </div>
    `,
    footerHtml: `
      <button class="btn ghost" data-close-modal="1">Hủy</button>
      <button class="btn" id="confirmWithdrawBtn">Xác nhận rút tiền</button>
    `
  });
  $('#confirmWithdrawBtn').addEventListener('click', () => {
    WALLET_HISTORY.unshift({
      date: formatToday(),
      title: 'Rút tiền về tài khoản Vietcombank',
      amount: '-' + formatCurrency(APP_STATE.walletBalance),
      status: 'Đang chuyển khoản'
    });
    APP_STATE.walletBalance = 0;
    renderWalletAndAccount();
    closeModal();
    showToast('💸 Đã tạo lệnh rút tiền thành công!');
  });
});

$('#availToggle').addEventListener('change', e => {
  $('#availStatusLabel').textContent = e.target.checked ? '🟢 Sẵn sàng' : '⏸️ Đang tạm nghỉ';
  $('#availStatusLabel').style.color = e.target.checked ? 'var(--good)' : 'var(--mut)';
  showToast(e.target.checked ? '🟢 Đã bật trạng thái Sẵn sàng nhận việc' : '⏸️ Đã chuyển sang chế độ Tạm nghỉ');
});

$('#copyRefBtn').addEventListener('click', () => {
  showToast('📋 Đã sao chép link giới thiệu bạn bè!');
});

/* ============================================================================
   VIEW 4: PHÒNG LÀM VIỆC & CHECKLIST NGHIỆM THU + CHAT
   ============================================================================ */
const WORKSPACE_MESSAGES = [
  { sender: 'Chuỗi Thời trang M.L', time: '09:00', text: 'Chào Phương Thảo, shop đã đính kèm bảng thông số 20 mẫu đầm công sở. Bạn lưu ý nhấn mạnh chất vải ít nhăn nhé!' },
  { sender: 'Nguyễn Phương Thảo', time: '09:05', text: 'Dạ vâng ạ, em đang rà soát từng bài theo đúng 4 mục trong Checklist trước khi bấm nộp bài.' }
];

function renderWorkspaceChat() {
  const box = $('#wsChatBox');
  box.innerHTML = WORKSPACE_MESSAGES.map(m => `
    <div style="background:${m.sender.includes('Phương Thảo') ? 'var(--ob)' : 'var(--s)'};padding:10px 12px;border-radius:10px;border:1px solid var(--line)">
      <div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:3px">
        <b style="color:var(--br)">${escapeHtml(m.sender)}</b>
        <span class="muted2">${escapeHtml(m.time)}</span>
      </div>
      <div style="font-size:13.5px">${escapeHtml(m.text)}</div>
    </div>
  `).join('');
  box.scrollTop = box.scrollHeight;
}
renderWorkspaceChat();

$('#sendChatBtn').addEventListener('click', () => {
  const inp = $('#wsChatInput');
  const txt = inp.value.trim();
  if (!txt) return;
  WORKSPACE_MESSAGES.push({ sender: 'Nguyễn Phương Thảo', time: 'Vừa xong', text: txt });
  inp.value = '';
  renderWorkspaceChat();
});
$('#wsChatInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#sendChatBtn').click(); });

$$('.ws-chk').forEach(chk => {
  chk.addEventListener('change', () => {
    const all = $$('.ws-chk');
    const done = all.filter(c => c.checked).length;
    $('#wsChkProgressText').textContent = done === all.length
      ? '✅ Đã đạt 4/4 tiêu chí tự kiểm Lớp 1. Bạn có thể nộp sản phẩm!'
      : `Đã hoàn thành ${done}/${all.length} tiêu chí nghiệm thu.`;
    $('#wsSubmitBtn').disabled = done !== all.length;
  });
});

// Upload file trong Workspace
$('#wsDropzone').addEventListener('click', () => $('#wsFileInput').click());
$('#wsFileInput').addEventListener('change', e => {
  if (e.target.files[0]) {
    APP_STATE.pendingSubmission.fileName = e.target.files[0].name;
    $('#wsDropzoneText').innerHTML = `✅ Đã đính kèm file bàn giao: <b>${escapeHtml(e.target.files[0].name)}</b>`;
  }
});

$('#wsSubmitBtn').addEventListener('click', () => {
  APP_STATE.pendingSubmission.docLink = $('#wsSubmissionLink').value.trim();
  APP_STATE.pendingSubmission.status = 'submitted_to_admin';
  $('#kStep3').className = 'k-step done';
  $('#kStep3').textContent = '✓ 3. Đã nộp bài';
  $('#kStep4').className = 'k-step curr';
  $('#wsSubmitBtn').disabled = true;
  $('#wsSubmitBtn').textContent = '✓ Đã gửi lên Admin duyệt Lớp 2';
  renderAdminQueue();
  showToast('🚀 Đã nộp sản phẩm! Chuyển sang mục Quản trị để duyệt Lớp 2.');
});

$('#reportIssueBtn').addEventListener('click', () => {
  openModal({
    title: 'Báo cáo vấn đề / Yêu cầu phân xử (Phản hồi trong 24h)',
    bodyHtml: `
      <p class="muted2" style="margin-top:0">Hệ thống tự động trích xuất Brief ban đầu, sản phẩm đã nộp và toàn bộ lịch sử tin nhắn làm bằng chứng phân xử.</p>
      <label><b>Mô tả vấn đề bạn đang gặp phải</b></label>
      <textarea id="disputeReasonInput" placeholder="VD: Khách hàng yêu cầu làm thêm ngoài phạm vi Checklist ban đầu..." style="margin-top:6px"></textarea>
    `,
    footerHtml: `
      <button class="btn ghost" data-close-modal="1">Hủy</button>
      <button class="btn" id="sendDisputeBtn" style="background:var(--bad);border-color:var(--bad)">Gửi báo cáo ngay</button>
    `
  });
  $('#sendDisputeBtn').addEventListener('click', () => {
    closeModal();
    showToast('🛡️ Đã ghi nhận phiếu khiếu nại. Admin sẽ phản hồi trong vòng 24 giờ!');
  });
});

/* ============================================================================
   VIEW 5: CỔNG XÁC THỰC MÃ QR & IN CHỨNG NHẬN PDF CÓ WATERMARK
   ============================================================================ */
function renderVerifyCertificate(code) {
  const cleanCode = String(code || '').toUpperCase().trim();
  const cert = CERTIFICATES_DB[cleanCode];
  const container = $('#verifyResultContainer');

  if (!cert) {
    container.innerHTML = `
      <div class="tool" style="background:var(--bad-bg);border-color:var(--bad);text-align:center;padding:28px">
        <span class="tag bd">✕ Không tìm thấy mã xác thực</span>
        <p style="margin:10px 0 0;font-weight:600">Mã “${escapeHtml(code)}” không tồn tại trên hệ thống VeriWork.</p>
      </div>
    `;
    $('#apiJsonPreview').textContent = JSON.stringify({ valid: false, error: 'CERTIFICATE_NOT_FOUND', queriedCode: cleanCode }, null, 2);
    return;
  }

  container.innerHTML = `
    <div class="tool" style="background:var(--s2);border:2px solid var(--br);position:relative;overflow:hidden">
      <div class="verify-cert-head">
        <div>
          <span class="tag ok" style="margin-bottom:6px">✓ CHỨNG CHỈ HỢP LỆ • ĐÃ XÁC THỰC 2 LỚP</span>
          <h3 style="margin:0 0 2px;font-size:20px">${escapeHtml(cert.studentName)}</h3>
          <p class="muted2" style="margin:0">${escapeHtml(cert.uni)}</p>
        </div>
        <div style="width:86px;height:86px;background:#fff;padding:6px;border-radius:10px;border:1px solid var(--line)">
          ${generateQrSvg(cert.code)}
        </div>
      </div>
      <hr style="border:0;border-top:1px solid var(--line);margin:14px 0">
      <div class="fl"><b>Mã thẻ:</b> <span>${escapeHtml(cert.code)} (Cấp ngày ${escapeHtml(cert.issuedDate)})</span></div>
      <div class="fl"><b>Dự án thực hiện:</b> <span style="color:var(--br);font-weight:700">${escapeHtml(cert.projectTitle)}</span></div>
      <div class="fl"><b>Khách hàng xác nhận:</b> <span>${escapeHtml(cert.clientName)}</span></div>
      <div class="fl"><b>Kết quả nghiệm thu:</b> <span>${escapeHtml(cert.checklistResult)}</span></div>
      <div class="fl"><b>Đánh giá:</b> <span>${escapeHtml(cert.rating)} — “${escapeHtml(cert.review)}”</span></div>
      <div class="fl"><b>Trạng thái Portfolio:</b> <span>${escapeHtml(cert.licenseStatus)}</span></div>
      <div style="margin-top:8px">
        <span class="muted2" style="font-size:12px">Chữ ký băm SHA-256 chống chỉnh sửa:</span>
        <code class="hash-code">${escapeHtml(cert.hash)}</code>
      </div>
      <div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span class="muted2" style="font-size:11.5px">🛡️ Watermark: Kiểm chứng tại veriwork.vn/verify/${escapeHtml(cert.code)}</span>
        <button class="btn o sm" onclick="window.print()">🖨️ In / Lưu PDF</button>
      </div>
    </div>
  `;

  $('#apiJsonPreview').textContent = JSON.stringify({
    valid: true,
    verifiedBy: 'VeriWork Trust Layer v2.0',
    timestamp: new Date().toISOString(),
    certificate: cert
  }, null, 2);
}
renderVerifyCertificate('EXP-2026-000124');

$('#verifyLookupBtn').addEventListener('click', () => renderVerifyCertificate($('#verifyCodeInput').value));
$('#sampleCodeButtons').addEventListener('click', e => {
  const btn = e.target.closest('[data-vcode]');
  if (!btn) return;
  $('#verifyCodeInput').value = btn.dataset.vcode;
  renderVerifyCertificate(btn.dataset.vcode);
});
$('#toggleApiJsonBtn').addEventListener('click', () => {
  const pre = $('#apiJsonPreview');
  pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
});

/* ============================================================================
   VIEW 6: ĐĂNG NHẬP / ĐĂNG KÝ (.EDU.VN CHECK) & ONBOARDING
   ============================================================================ */
let authMode = 'login';
function renderAuthView() {
  if (authMode === 'login') {
    $('#authFormContainer').innerHTML = `
      <div style="display:grid;gap:12px">
        <div>
          <label><b>Email tài khoản (.edu.vn hoặc Email doanh nghiệp)</b></label>
          <input type="text" value="phuongthao.22@neu.edu.vn" style="margin-top:4px">
        </div>
        <div>
          <label><b>Mật khẩu</b></label>
          <input type="password" value="••••••••••••" style="margin-top:4px">
        </div>
        <button class="btn" id="doLoginBtn" style="margin-top:6px">Đăng nhập vào VeriWork</button>
      </div>
    `;
    $('#doLoginBtn').addEventListener('click', () => {
      switchView('home');
      showToast('👋 Chào mừng Nguyễn Phương Thảo quay trở lại!');
    });
  } else {
    $('#authFormContainer').innerHTML = `
      <div style="display:grid;gap:12px">
        <div>
          <label><b>Nhập Email trường đại học (.edu.vn) để xác minh tự động *</b></label>
          <input id="regEduEmail" type="text" placeholder="VD: sinhvien@neu.edu.vn hoặc @hust.edu.vn" style="margin-top:4px">
          <div id="eduCheckFeedback" class="muted2" style="margin-top:4px;font-size:12.5px">Hệ thống kiểm tra bản ghi tên miền .edu.vn theo thời gian thực.</div>
        </div>
        <div>
          <label><b>Họ và tên thật (Trùng khớp thẻ sinh viên / CCCD) *</b></label>
          <input id="regFullName" type="text" placeholder="VD: Nguyễn Phương Thảo" style="margin-top:4px">
        </div>
        <button class="btn" id="doRegisterBtn">Hoàn tất đăng ký & Mở hồ sơ</button>
      </div>
    `;
    const emailInp = $('#regEduEmail');
    emailInp.addEventListener('input', () => {
      const v = emailInp.value.trim().toLowerCase();
      const fb = $('#eduCheckFeedback');
      if (v.endsWith('.edu.vn') && v.includes('@')) {
        fb.innerHTML = '<span style="color:var(--good);font-weight:700">✓ Tên miền trường học (.edu.vn) hợp lệ! Được cấp ngay huy hiệu 🟢 Email .edu.vn.</span>';
      } else {
        fb.innerHTML = '<span style="color:var(--wt)">⚠️ Vui lòng dùng email đuôi .edu.vn (hoặc chuẩn bị CCCD ở bước tiếp theo).</span>';
      }
    });
    $('#doRegisterBtn').addEventListener('click', () => {
      showToast('🎉 Đăng ký thành công! Đã kích hoạt huy hiệu xác minh .edu.vn');
      switchView('profile');
    });
  }
}
renderAuthView();

$('#authModeTabs').addEventListener('click', e => {
  const btn = e.target.closest('[data-auth-mode]');
  if (!btn) return;
  authMode = btn.dataset.authMode;
  $$('#authModeTabs button').forEach(b => b.setAttribute('aria-pressed', b === btn));
  renderAuthView();
});

/* ============================================================================
   VIEW 7: QUẢN TRỊ VIÊN (DUYỆT LỚP 2 PHÁT HÀNH THẺ QR) & 4 CÔNG CỤ PHÁP LÝ
   ============================================================================ */
function renderAdminQueue() {
  const sub = APP_STATE.pendingSubmission;
  if (sub.status === 'approved') {
    $('#adminQueueBox').innerHTML = `
      <div class="fl">
        <span class="tag ok">✓ Đã duyệt Lớp 2 & Cấp thẻ EXP-2026-000312</span>
        <span>Đơn hàng <b>${escapeHtml(sub.projectTitle)}</b> đã hoàn tất nghiệm thu và giải ngân.</span>
      </div>
    `;
    return;
  }
  $('#adminQueueBox').innerHTML = `
    <div style="background:var(--bg);padding:16px;border-radius:12px;border:1px solid var(--line)">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
        <span class="tag ${sub.status === 'submitted_to_admin' ? 'w2' : 'nt'}">
          ${sub.status === 'submitted_to_admin' ? '● Đang chờ Admin duyệt Lớp 2' : '⏳ Sinh viên đang làm bài'}
        </span>
        <b>Ngân sách Escrow: ${formatCurrency(sub.budget)}</b>
      </div>
      <h4 style="margin:0 0 4px">${escapeHtml(sub.projectTitle)}</h4>
      <p class="muted2" style="margin:0 0 10px">Sinh viên: <b>${escapeHtml(sub.studentName)}</b> • Khách hàng: <b>${escapeHtml(sub.clientName)}</b></p>
      <div class="muted2" style="margin-bottom:12px">Tài liệu bàn giao: <code style="background:var(--s);padding:3px 8px;border-radius:6px">${escapeHtml(sub.docLink)}</code></div>
      <button class="btn sm" id="adminApproveBtn">✓ Duyệt Lớp 2 → Cấp Thẻ QR (EXP-2026-000312) & Giải ngân</button>
    </div>
  `;

  $('#adminApproveBtn').addEventListener('click', () => {
    sub.status = 'approved';
    const newCode = 'EXP-2026-000312';
    CERTIFICATES_DB[newCode] = {
      code: newCode,
      studentName: sub.studentName,
      uni: 'ĐH Kinh tế Quốc dân (Đã xác thực .edu.vn)',
      role: 'Content Writer',
      projectTitle: sub.projectTitle,
      clientName: sub.clientName,
      issuedDate: formatToday(),
      rating: '5.0 / 5.0 ★★★★★',
      review: 'Sản phẩm vượt qua cả 2 lớp nghiệm thu, văn phong chuẩn chỉnh, bàn giao đúng hạn.',
      checklistResult: 'Đạt 100% tiêu chí Checklist Lớp 1 & Lớp 2',
      licenseStatus: 'Published (Vừa cấp mới)',
      hash: '9b74c9897bac770ffc029102a200c5de0842f8901d7a9c88b59b2dc327aa4312'
    };
    PORTFOLIO_ITEMS.unshift({
      code: newCode,
      title: sub.projectTitle,
      client: sub.clientName,
      date: formatToday(),
      rating: '5.0 ★',
      published: true,
      excerpt: 'Dự án vừa được nghiệm thu và phát hành Thẻ kinh nghiệm tự động.'
    });
    APP_STATE.walletBalance += sub.budget;
    WALLET_HISTORY.unshift({
      date: formatToday(),
      title: `Giải ngân dự án: ${sub.projectTitle}`,
      amount: '+' + formatCurrency(sub.budget),
      status: 'Hoàn tất'
    });
    if (!$('#sampleCodeButtons').querySelector(`[data-vcode="${newCode}"]`)) {
      const btn = document.createElement('button');
      btn.className = 'btn ghost sm';
      btn.dataset.vcode = newCode;
      btn.textContent = newCode + ' (Mới)';
      $('#sampleCodeButtons').appendChild(btn);
    }
    $('#statCardsCount').textContent = '129 thẻ đã cấp';
    renderAdminQueue();
    renderProfileTimelineAndLogs();
    renderWalletAndAccount();
    $('#verifyCodeInput').value = newCode;
    renderVerifyCertificate(newCode);
    showToast(`🎉 Đã phát hành thẻ ${newCode} và cộng ${formatCurrency(sub.budget)} vào Ví!`);
  });
}
renderAdminQueue();

/* 4 Công cụ Pháp lý Điện tử */
const LEGAL_TABS = {
  chk: '🛡️ 1. Bộ lọc chống lừa đảo',
  hd: '✍️ 2. Hợp đồng & Portfolio License',
  ev: '🔒 3. Niêm phong bằng chứng SHA-256',
  dl: '👤 4. Quyền dữ liệu (NĐ 13/2023)'
};
const LEGAL_STATE = {
  activeTab: 'chk',
  testText: '',
  contractSigned: null,
  signerName: 'Nguyễn Phương Thảo',
  evidenceText: 'Khách hàng yêu cầu 20 bài mô tả sản phẩm, mỗi bài 120 từ, bàn giao trước 18h00 thứ Sáu.',
  sealedRecord: null,
  compareStatus: ''
};

async function computeSha256(str) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return 'sha256-8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4';
  }
}

function renderLegalTabs() {
  $('#legalToolTabs').innerHTML = Object.entries(LEGAL_TABS).map(([k, label]) => `
    <button data-legal-tab="${k}" aria-pressed="${LEGAL_STATE.activeTab === k}">${label}</button>
  `).join('');
}

function renderLegalPanel() {
  const tab = LEGAL_STATE.activeTab;
  if (tab === 'chk') {
    const violations = PROHIBITED_RULES.filter(r => r[0].test(normalizeText(LEGAL_STATE.testText)));
    $('#legalToolPanel').innerHTML = `
      <label><b>Kiểm tra mô tả dự án trước khi hiển thị</b></label>
      <textarea id="legalTestInput" style="margin-top:6px" placeholder="Nhập thử nội dung tuyển dụng để kiểm tra bộ lọc chặn đặt cọc / thu phí...">${escapeHtml(LEGAL_STATE.testText)}</textarea>
      <div style="display:flex;gap:8px;margin:10px 0;flex-wrap:wrap">
        <button class="btn ghost sm" id="loadScamSampleBtn">Thử mẫu tin lừa đảo đặt cọc</button>
        <button class="btn ghost sm" id="loadValidSampleBtn">Thử mẫu tin hợp lệ</button>
      </div>
      <div>
        ${!LEGAL_STATE.testText.trim()
          ? '<p class="muted2">Kết quả quét tự động sẽ hiển thị tại đây.</p>'
          : violations.length
            ? violations.map(v => `<div class="fl"><span class="tag bd">Chặn tự động</span><div><b>${v[1]}</b><br><span class="muted2">${v[2]}</span></div></div>`).join('')
            : '<div class="fl"><span class="tag ok">Hợp lệ</span><div><b>Không phát hiện từ khóa vi phạm</b></div></div>'}
      </div>
    `;
    $('#legalTestInput').addEventListener('input', e => {
      LEGAL_STATE.testText = e.target.value;
      renderLegalPanel();
      const el = $('#legalTestInput');
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
    $('#loadScamSampleBtn').addEventListener('click', () => {
      LEGAL_STATE.testText = 'Tuyển sinh viên nhập liệu tại nhà, yêu cầu đặt cọc 200k giữ chỗ, gửi ảnh CCCD và viết đánh giá ảo cho shop.';
      renderLegalPanel();
    });
    $('#loadValidSampleBtn').addEventListener('click', () => {
      LEGAL_STATE.testText = 'Cần viết 20 bài mô tả sản phẩm thời trang nữ công sở, 120 từ/bài, ngân sách 600.000đ qua Escrow.';
      renderLegalPanel();
    });
  } else if (tab === 'hd') {
    $('#legalToolPanel').innerHTML = `
      <p class="muted2" style="margin-top:0">Hợp đồng cộng tác viên quy định rõ: Sản phẩm thuộc sở hữu khách hàng sau thanh toán; Khách hàng cấp cho sinh viên <b>Portfolio License</b> không độc quyền để chứng minh kinh nghiệm; Không thiết lập quan hệ lao động.</p>
      <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <label><b>Họ tên người ký điện tử</b></label>
          <input id="contractSignerInp" type="text" value="${escapeHtml(LEGAL_STATE.signerName)}" style="margin-top:4px">
        </div>
        <button class="btn" id="signContractBtn">Ký hợp đồng điện tử</button>
      </div>
      ${LEGAL_STATE.contractSigned ? `
        <div style="margin-top:12px">
          <span class="tag ok">✓ Đã ký số bởi ${escapeHtml(LEGAL_STATE.contractSigned.name)} lúc ${escapeHtml(LEGAL_STATE.contractSigned.time)}</span>
          <code class="hash-code">${escapeHtml(LEGAL_STATE.contractSigned.hash)}</code>
        </div>
      ` : ''}
    `;
    $('#signContractBtn').addEventListener('click', async () => {
      const name = $('#contractSignerInp').value.trim() || 'Nguyễn Phương Thảo';
      LEGAL_STATE.signerName = name;
      LEGAL_STATE.contractSigned = {
        name,
        time: formatNow(),
        hash: await computeSha256(name + '|' + formatNow())
      };
      renderLegalPanel();
      showToast('✍️ Đã ký hợp đồng & ghi nhận Portfolio License!');
    });
  } else if (tab === 'ev') {
    $('#legalToolPanel').innerHTML = `
      <label><b>Nội dung Brief / Tin nhắn cần niêm phong SHA-256 làm bằng chứng phân xử</b></label>
      <textarea id="evidenceInp" style="margin-top:6px">${escapeHtml(LEGAL_STATE.evidenceText)}</textarea>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <button class="btn sm" id="sealEvidenceBtn">🔒 Niêm phong nội dung</button>
        ${LEGAL_STATE.sealedRecord ? `<button class="btn ghost sm" id="verifyEvidenceBtn">Đối chiếu tính toàn vẹn</button>` : ''}
      </div>
      ${LEGAL_STATE.sealedRecord ? `
        <div style="margin-top:12px">
          <span class="tag ok">Đã niêm phong lúc ${escapeHtml(LEGAL_STATE.sealedRecord.time)}</span>
          <code class="hash-code">${escapeHtml(LEGAL_STATE.sealedRecord.hash)}</code>
        </div>
      ` : ''}
      ${LEGAL_STATE.compareStatus ? `
        <div style="margin-top:10px">
          <span class="tag ${LEGAL_STATE.compareStatus === 'match' ? 'ok' : 'bd'}">
            ${LEGAL_STATE.compareStatus === 'match' ? '✓ Khớp 100%: Nội dung nguyên vẹn' : '✕ Cảnh báo: Nội dung đã bị chỉnh sửa sau khi niêm phong!'}
          </span>
        </div>
      ` : ''}
    `;
    $('#evidenceInp').addEventListener('input', e => { LEGAL_STATE.evidenceText = e.target.value; });
    $('#sealEvidenceBtn').addEventListener('click', async () => {
      LEGAL_STATE.sealedRecord = {
        time: formatNow(),
        hash: await computeSha256(LEGAL_STATE.evidenceText)
      };
      LEGAL_STATE.compareStatus = '';
      renderLegalPanel();
      showToast('🔒 Đã tạo chữ ký niêm phong SHA-256');
    });
    const vBtn = $('#verifyEvidenceBtn');
    if (vBtn) {
      vBtn.addEventListener('click', async () => {
        const currentHash = await computeSha256(LEGAL_STATE.evidenceText);
        LEGAL_STATE.compareStatus = currentHash === LEGAL_STATE.sealedRecord.hash ? 'match' : 'tampered';
        renderLegalPanel();
      });
    }
  } else {
    $('#legalToolPanel').innerHTML = `
      <p class="muted2" style="margin-top:0">Tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân: CCCD và MST được mã hóa và chỉ Admin thấy. Người dùng có toàn quyền xuất dữ liệu hoặc yêu cầu xóa tài khoản.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn ghost sm" id="exportDataBtn">📥 Xuất dữ liệu cá nhân (JSON)</button>
        <button class="btn ghost sm" id="deleteDataBtn" style="color:var(--bad);border-color:var(--bad)">🗑️ Yêu cầu xóa dữ liệu cá nhân</button>
      </div>
    `;
    $('#exportDataBtn').addEventListener('click', () => showToast('📥 Đã trích xuất bản sao dữ liệu cá nhân của bạn'));
    $('#deleteDataBtn').addEventListener('click', () => showToast('🛡️ Đã ghi nhận yêu cầu xóa dữ liệu theo Nghị định 13/2023/NĐ-CP'));
  }
}
renderLegalTabs();
renderLegalPanel();

$('#legalToolTabs').addEventListener('click', e => {
  const btn = e.target.closest('[data-legal-tab]');
  if (!btn) return;
  LEGAL_STATE.activeTab = btn.dataset.legalTab;
  renderLegalTabs();
  renderLegalPanel();
});

/* G4: Pull-to-refresh trên thiết bị cảm ứng */
let touchStartY = 0;
window.addEventListener('touchstart', e => {
  if (window.scrollY === 0) touchStartY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchmove', e => {
  if (window.scrollY === 0 && touchStartY > 0 && e.touches[0].clientY - touchStartY > 95) {
    const banner = $('#ptrBanner');
    if (!banner.classList.contains('active')) {
      banner.classList.add('active');
      setTimeout(() => {
        banner.classList.remove('active');
        renderProjectsGrid();
        showToast('🔄 Đã làm mới danh sách dự án!');
      }, 700);
    }
    touchStartY = 0;
  }
}, { passive: true });
