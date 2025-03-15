export default async function handler(req, res) {
  // Kiểm tra session và quyền admin
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Bạn cần đăng nhập" });
  }

  if (session.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Bạn không có quyền thực hiện hành động này" });
  }
  const examSchedule = await prisma.examSchedule.findMany();
  res.status(200).json(examSchedule);
}
