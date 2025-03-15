import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, username, password, phone } = req.body;

    // Kiểm tra username đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username đã tồn tại' });
    }

    // Kiểm tra số điện thoại đã tồn tại
    const existingPhone = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        phone,
        roleId: 1,
      },
    });

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký' });
  }
} 