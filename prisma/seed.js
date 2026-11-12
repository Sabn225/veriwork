import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Đang nạp dữ liệu mẫu vào Supabase...');

  const defaultPassword = await bcrypt.hash('123456', 10);

  // 1. Tạo 3 tài khoản mẫu
  const student = await prisma.user.upsert({
    where: { email: 'minhanh.23@neu.edu.vn' },
    update: {},
    create: {
      email: 'minhanh.23@neu.edu.vn',
      passwordHash: defaultPassword,
      fullName: 'Nguyễn Minh Anh',
      username: 'minhanh',
      university: 'ĐH Kinh tế Quốc dân',
      headline: 'Sinh viên năm 3 Marketing • Chuyên viết mô tả sản phẩm thời trang & F&B chuẩn SEO.',
      role: 'STUDENT',
      eduVerified: true,
      phoneVerified: true,
      identityVerified: true,
      trustScore: 92,
      walletBalance: 1350000,
      escrowLocked: 600000
    }
  });

  const client = await prisma.user.upsert({
    where: { email: 'contact@lashop.vn' },
    update: {},
    create: {
      email: 'contact@lashop.vn',
      passwordHash: defaultPassword,
      fullName: 'Chuỗi Thời trang Thiết kế L.A',
      username: 'lashop',
      role: 'CLIENT',
      phoneVerified: true,
      identityVerified: true,
      trustScore: 98
    }
  });

  await prisma.user.upsert({
    where: { email: 'admin@veriwork.vn' },
    update: {},
    create: {
      email: 'admin@veriwork.vn',
      passwordHash: defaultPassword,
      fullName: 'Quản trị viên VeriWork',
      username: 'admin',
      role: 'ADMIN',
      eduVerified: true,
      phoneVerified: true,
      identityVerified: true,
      trustScore: 100
    }
  });

  // 2. Tạo dự án đã hoàn thành gắn với Thẻ kinh nghiệm EXP-2026-000124
  const completedProj = await prisma.project.create({
    data: {
      title: 'Viết mô tả cho 20 sản phẩm thời trang nữ Thu Đông',
      category: 'viet',
      brief: 'Viết 20 bài mô tả sản phẩm đầm và áo khoác Thu Đông chuẩn SEO.',
      budget: 600000,
      deadlineDays: 7,
      checklist: [
        'Độ dài mỗi bài từ 100 – 140 từ',
        'Chèn tự nhiên 1 từ khóa chính',
        'Nêu rõ thông số 3 size S/M/L',
        'Độc bản 100%'
      ],
      status: 'COMPLETED',
      clientName: 'Shop Thời trang L.A (Đã xác thực MST)',
      clientId: client.id
    }
  });

  const rawHash = `EXP-2026-000124|${student.id}|${completedProj.id}|5.0`;
  const signature = crypto.createHash('sha256').update(rawHash).digest('hex');

  await prisma.experienceCard.upsert({
    where: { code: 'EXP-2026-000124' },
    update: {},
    create: {
      code: 'EXP-2026-000124',
      studentId: student.id,
      projectId: completedProj.id,
      roleTitle: 'Content Writer',
      rating: 5.0,
      clientReview: 'Bài viết đúng chuẩn SEO, lồng ghép khéo léo chất liệu vải và bảng size. Giao bài sớm 1 ngày.',
      checklistResult: '20/20 bài đạt 100% tiêu chí ở vòng duyệt đầu tiên',
      passedFirstAttempt: true,
      onTime: true,
      portfolioPublished: true,
      sha256Signature: signature
    }
  });

  // 3. Tạo các dự án đang mở
  await prisma.project.createMany({
    data: [
      {
        title: 'Viết mô tả cho 20 sản phẩm thời trang nữ công sở',
        category: 'viet',
        brief: 'Viết 20 bài mô tả sản phẩm đầm và áo sơ mi công sở gắn lên website. Giọng văn thanh lịch, nêu rõ phom dáng, chất liệu và hướng dẫn bảo quản.',
        budget: 600000,
        deadlineDays: 7,
        featured: true,
        applicantCount: 4,
        checklist: [
          'Độ dài mỗi bài từ 100 – 140 từ',
          'Chèn tự nhiên 1 từ khóa chính',
          'Nêu rõ thông số 3 size S/M/L',
          'Độc bản 100%'
        ],
        status: 'OPEN',
        clientName: 'Chuỗi Thời trang Thiết kế M.L (Đã xác minh MST)',
        clientId: client.id
      },
      {
        title: 'Viết 15 bài đăng fanpage cho quán Cafe Specialty',
        category: 'viet',
        brief: 'Xây dựng 15 bài đăng giới thiệu hạt cà phê rang mộc, không gian đọc sách yên tĩnh và ưu đãi buổi sáng cho dân văn phòng.',
        budget: 450000,
        deadlineDays: 5,
        featured: false,
        applicantCount: 3,
        checklist: [
          'Mỗi bài từ 80 – 120 từ kèm CTA',
          'Đính kèm bộ 5 hashtag',
          'Đúng tông giọng của quán'
        ],
        status: 'OPEN',
        clientName: 'Tiệm Cafe H.A (Đã xác minh SĐT & GPKD)',
        clientId: client.id
      },
      {
        title: 'Viết mô tả 30 sản phẩm phụ kiện gốm sứ thủ công',
        category: 'viet',
        brief: 'Viết mô tả theo lối storytelling cho 30 mẫu cốc, bình hoa và đĩa gốm thủ công.',
        budget: 750000,
        deadlineDays: 10,
        featured: false,
        applicantCount: 6,
        checklist: [
          'Độ dài 120 – 150 từ/sản phẩm',
          'Nêu rõ kích thước, chất men',
          'Đạt kiểm tra không đạo văn'
        ],
        status: 'OPEN',
        clientName: 'Xưởng Gốm B.T (Đã xác minh MST)',
        clientId: client.id
      }
    ]
  });

  console.log('✅ Đã nạp thành công dữ liệu mẫu! Mật khẩu mặc định: 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });