import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Đảm bảo thư mục lưu file upload tồn tại
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer lưu file đính kèm
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // Giới hạn 25MB
});

// Middleware xác thực JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Vui lòng đăng nhập để thực hiện' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
    req.user = user;
    next();
  });
}

// Bộ lọc chặn tin lừa đảo / thu phí
const SCAM_PATTERNS = [
  /dat coc|nop phi|dong phi|phi dao tao|ung tien|phi giu cho/i,
  /cccd|can cuoc|mat khau|password|otp|so tai khoan/i,
  /da cap|mlm|keo nguoi|seeding|danh gia ao|review ao/i,
  /ca do|co bac|casino|nha cai|hang fake|super fake/i
];

function checkScam(text) {
  const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  return SCAM_PATTERNS.some(p => p.test(normalized));
}

// ==================== AUTH APIS ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, role, university } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const isEdu = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.vn$/i.test(email.trim());
    if (role === 'STUDENT' && !isEdu) {
      return res.status(400).json({ error: 'Sinh viên bắt buộc sử dụng email đuôi .edu.vn' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email này đã tồn tại' });

    const passwordHash = await bcrypt.hash(password, 10);
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(100 + Math.random() * 900);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        username,
        role: role || 'STUDENT',
        university: university || null,
        eduVerified: isEdu,
        trustScore: 80
      }
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: newUser.id, fullName: newUser.fullName, username: newUser.username, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Tài khoản hoặc mật khẩu không chính xác' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'Tài khoản hoặc mật khẩu không chính xác' });

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        email: user.email,
        trustScore: user.trustScore,
        walletBalance: user.walletBalance,
        escrowLocked: user.escrowLocked
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        role: true,
        university: true,
        headline: true,
        eduVerified: true,
        phoneVerified: true,
        identityVerified: true,
        trustScore: true,
        walletBalance: true,
        escrowLocked: true
      }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xác thực: ' + err.message });
  }
});

// ==================== FILE UPLOAD API ====================

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Vui lòng chọn một tệp để tải lên' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileUrl,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// ==================== PROJECT APIS ====================

app.get('/api/projects', async (req, res) => {
  try {
    const { category, status } = req.query;
    const where = {};
    if (category && category !== 'all') where.category = category;
    if (status) where.status = status;

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi truy xuất dự án: ' + err.message });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { title, brief, budget, deadlineDays, checklist, category } = req.body;
    if (!title || !brief || !budget) {
      return res.status(400).json({ error: 'Vui lòng cung cấp tiêu đề, mô tả và ngân sách' });
    }

    if (checkScam(`${title} ${brief}`)) {
      return res.status(400).json({ error: 'Dự án bị chặn: Chứa từ khóa vi phạm chính sách cấm' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const parsedBudget = Number(budget);
    const platformFee = Math.round(parsedBudget * 0.1);

    const newProject = await prisma.project.create({
      data: {
        title,
        brief,
        budget: parsedBudget,
        deadlineDays: Number(deadlineDays) || 5,
        checklist: checklist || ['Đảm bảo đúng Brief', 'Độc bản 100%', 'Bàn giao đúng hạn'],
        category: category || 'viet',
        clientName: user.fullName,
        clientId: user.id,
        status: 'PENDING_REVIEW', // Chờ khách chuyển khoản Escrow
        escrow: {
          create: {
            totalAmount: parsedBudget,
            platformFee,
            studentPayout: parsedBudget - platformFee,
            status: 'WAITING_DEPOSIT'
          }
        }
      },
      include: { escrow: true }
    });

    res.json({ success: true, project: newProject });
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo dự án: ' + err.message });
  }
});

// ==================== ESCROW & VIETQR PAYMENT ====================

// Lấy thông tin thanh toán VietQR động cho dự án
app.get('/api/projects/:id/payment-qr', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { escrow: true }
    });

    if (!project) return res.status(404).json({ error: 'Không tìm thấy dự án' });

    // Cấu hình tài khoản ngân hàng thụ hưởng (VietinBank / MB / Vietcombank...)
    const BANK_ID = process.env.BANK_ID || 'ICB'; // ICB = VietinBank, MB = MBBank, VCB = Vietcombank
    const ACCOUNT_NO = process.env.BANK_ACCOUNT || '101878999999';
    const ACCOUNT_NAME = encodeURIComponent(process.env.BANK_NAME || 'VERIWORK PLATFORM');
    const amount = project.budget;
    const memo = `VW${project.id.slice(0, 8).toUpperCase()}`;

    // Tạo link QR động theo chuẩn VietQR NAPAS 247
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${ACCOUNT_NAME}`;

    res.json({
      projectId: project.id,
      amount,
      memo,
      bankId: BANK_ID,
      accountNo: ACCOUNT_NO,
      qrUrl,
      status: project.escrow?.status || 'WAITING_DEPOSIT'
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tạo mã QR: ' + err.message });
  }
});

// Webhook nhận thông báo chuyển khoản tự động (Tích hợp SePay/Casso)
app.post('/api/webhooks/sepay', async (req, res) => {
  try {
    const { content, transferAmount } = req.body;
    if (!content) return res.status(400).send('Invalid webhook data');

    // Tìm mã dạng VWXXXXXXXX trong nội dung chuyển khoản
    const match = content.match(/VW([A-Z0-9]{8})/i);
    if (!match) return res.status(200).send('Không tìm thấy mã dự án trong nội dung');

    const prefix = match[1].toLowerCase();

    // Tìm dự án có ID bắt đầu bằng 8 ký tự
    const project = await prisma.project.findFirst({
      where: { id: { startsWith: prefix } },
      include: { escrow: true }
    });

    if (project && project.budget <= Number(transferAmount)) {
      const platformFee = Math.round(project.budget * 0.1);
      const studentPayout = project.budget - platformFee;

      // Dùng upsert: nếu chưa có escrow thì tạo mới, có rồi thì đổi thành HELD
      await prisma.escrowTransaction.upsert({
        where: { projectId: project.id },
        update: { status: 'HELD' },
        create: {
          projectId: project.id,
          totalAmount: project.budget,
          platformFee,
          studentPayout,
          status: 'HELD'
        }
      });

      // Mở trạng thái dự án sang OPEN để sinh viên có thể nhận
      await prisma.project.update({
        where: { id: project.id },
        data: { status: 'OPEN' }
      });

      console.log(`✅ [ESCROW] Khách đã nạp ${transferAmount}đ cho dự án: ${project.title}`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Lỗi Webhook:', err);
    res.status(500).send('Webhook process error: ' + err.message);
  }
});

// ==================== WORKSPACE & SUBMISSION APIS ====================

// Sinh viên nộp bài kèm file & Checklist Lớp 1
app.post('/api/projects/:id/submit', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { deliverableUrl, notes, l1Checklist } = req.body;

    if (!deliverableUrl) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đường dẫn hoặc tệp bàn giao' });
    }

    if (!l1Checklist || Object.values(l1Checklist).some(val => val !== true)) {
      return res.status(400).json({ error: 'Bạn phải tự rà soát và đánh dấu đủ 100% Checklist Lớp 1 trước khi gửi' });
    }

    const contentHash = crypto.createHash('sha256').update(deliverableUrl + (notes || '')).digest('hex');

    const submission = await prisma.submission.create({
      data: {
        projectId,
        studentId: req.user.id,
        deliverableUrl,
        notes: notes || '',
        l1Checklist,
        contentHash
      }
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'SUBMITTED_L1' }
    });

    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi nộp bài: ' + err.message });
  }
});

// Admin duyệt Checklist Lớp 2
app.post('/api/projects/:id/review-l2', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Chỉ Quản trị viên mới có quyền duyệt Lớp 2' });
    }

    const projectId = req.params.id;
    const { l2Checklist } = req.body;

    const latestSub = await prisma.submission.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestSub) return res.status(404).json({ error: 'Không tìm thấy bài nộp nào' });

    await prisma.submission.update({
      where: { id: latestSub.id },
      data: { l2Checklist }
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'APPROVED_L2' }
    });

    res.json({ success: true, message: 'Đã duyệt Lớp 2. Đã chuyển bài đến khách hàng để nghiệm thu.' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi duyệt bài: ' + err.message });
  }
});

// Khách hàng nghiệm thu -> Giải ngân Escrow -> Cấp Thẻ Kinh Nghiệm QR
app.post('/api/projects/:id/confirm-completion', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { rating, review } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        submissions: { orderBy: { createdAt: 'desc' }, take: 1 },
        escrow: true
      }
    });

    if (!project) return res.status(404).json({ error: 'Dự án không tồn tại' });
    if (project.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Chỉ chủ dự án mới có quyền nghiệm thu' });
    }

    const latestSub = project.submissions[0];
    if (!latestSub) return res.status(400).json({ error: 'Chưa có sản phẩm nào được bàn giao' });

    const cardCode = `EXP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const issuedAt = new Date().toISOString();

    const rawSignature = `${cardCode}|${latestSub.studentId}|${project.id}|${rating || 5.0}|${issuedAt}|${process.env.SERVER_SALT}`;
    const sha256Signature = crypto.createHash('sha256').update(rawSignature).digest('hex');

    const result = await prisma.$transaction(async (tx) => {
      // 1. Cấp Thẻ Kinh Nghiệm số
      const card = await tx.experienceCard.create({
        data: {
          code: cardCode,
          studentId: latestSub.studentId,
          projectId: project.id,
          roleTitle: project.category === 'viet' ? 'Content Writer' : 'Designer / Creator',
          rating: Number(rating) || 5.0,
          clientReview: review || 'Sản phẩm hoàn thành xuất sắc, đúng 100% tiêu chí Checklist.',
          checklistResult: 'Đạt chuẩn 100% qua 2 vòng kiểm duyệt',
          passedFirstAttempt: latestSub.revisionCount === 0,
          onTime: true,
          portfolioPublished: true,
          sha256Signature,
          issuedAt: new Date(issuedAt)
        }
      });

      // 2. Chuyển tiền từ Escrow vào ví sinh viên (trừ phí dịch vụ 10%)
      const studentPayout = project.escrow ? project.escrow.studentPayout : Math.round(project.budget * 0.9);

      await tx.user.update({
        where: { id: latestSub.studentId },
        data: {
          walletBalance: { increment: studentPayout },
          trustScore: { increment: 2 }
        }
      });

      // 3. Cập nhật Escrow sang RELEASED
      if (project.escrow) {
        await tx.escrowTransaction.update({
          where: { projectId: project.id },
          data: { status: 'RELEASED' }
        });
      }

      // 4. Đánh dấu dự án hoàn tất
      await tx.project.update({
        where: { id: project.id },
        data: { status: 'COMPLETED' }
      });

      return card;
    });

    res.json({ success: true, card: result });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi nghiệm thu và giải ngân: ' + err.message });
  }
});

// ==================== VERIFY QR API ====================

app.get('/api/verify/:code', async (req, res) => {
  try {
    const card = await prisma.experienceCard.findUnique({
      where: { code: req.params.code.toUpperCase() },
      include: {
        student: { select: { fullName: true, university: true, eduVerified: true } },
        project: { select: { title: true, clientName: true } }
      }
    });

    if (!card) return res.status(404).json({ error: 'Không tìm thấy chứng chỉ với mã này' });

    res.json({
      code: card.code,
      name: card.student.fullName,
      university: card.student.university || 'Sinh viên Đại học đã xác thực',
      role: card.roleTitle,
      project: card.project.title,
      client: card.project.clientName,
      date: new Date(card.issuedAt).toLocaleDateString('vi-VN'),
      rating: `${card.rating.toFixed(1)} / 5.0 ★★★★★`,
      review: card.clientReview,
      checklist: card.checklistResult,
      license: card.portfolioPublished
        ? 'Được cấp phép hiển thị công khai trên Portfolio (Portfolio License)'
        : 'Chứng nhận nội bộ',
      hash: card.sha256Signature
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tra cứu: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 VeriWork Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📦 Kết nối PostgreSQL Supabase & Multer Storage đã sẵn sàng.`);
  console.log(`💳 Cổng VietQR & Webhook SePay: /api/webhooks/sepay`);
  console.log(`=======================================================`);
});